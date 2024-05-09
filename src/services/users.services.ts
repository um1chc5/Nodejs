import { IUser, User } from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterRequestBody } from '~/models/requests/user.requests'
import { hashPassword } from '~/utils/encrypt'
import { signToken } from '~/utils/jwt'
import { TokenTypes, UserVerifyStatus } from '~/constants/enum'
import { ObjectId, WithId } from 'mongodb'
import { RefreshToken } from '~/models/schemas/Tokens.schema'
import { config } from 'dotenv'

config()

class UsersServices {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        tokenType: TokenTypes.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN
    })
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        tokenType: TokenTypes.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN
    })
  }

  private signEmailVerifyToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        tokenType: TokenTypes.EmailVerifyToken
      },
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRE
      },
      privateKey: process.env.JWT_FORGOT_PASSWORD_TOKEN
    })
  }

  private async signForgotPasswordToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        tokenType: TokenTypes.ForgotPasswordToken
      },
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE
      },
      privateKey: process.env.JWT_FORGOT_PASSWORD_TOKEN
    })
  }

  private generateTokens(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  private async deleteRefreshToken({ user_id, refresh_token }: { user_id?: string; refresh_token?: string }) {
    if (user_id) {
      await databaseService.refreshToken.deleteOne({ user_id: new ObjectId(user_id) })
    }

    if (refresh_token) {
      await databaseService.refreshToken.deleteOne({ token: refresh_token })
    }
  }

  private async insertNewRefreshToken(user_id: string, token: string) {
    databaseService.refreshToken.insertOne(new RefreshToken({ user_id: new ObjectId(user_id), token: token }))
  }

  async login(payload: WithId<IUser>) {
    const { _id: user_id, verify } = payload
    const [access_token, refresh_token] = await this.generateTokens(user_id.toString())

    await databaseService.refreshToken.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )

    return {
      access_token,
      refresh_token
    }
  }

  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString())

    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    const [access_token, refresh_token] = await this.generateTokens(user_id.toString())

    await databaseService.refreshToken.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )

    return {
      access_token,
      refresh_token
    }
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async logout(refresh_token: string) {
    const result = this.deleteRefreshToken({ refresh_token: refresh_token })
    return result
  }

  async verifyEmail(user_id: string) {
    const [tokens] = await Promise.all([
      this.generateTokens(user_id),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified
            // updated_at: new Date()
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    ])

    await Promise.all([this.deleteRefreshToken({ user_id: user_id }), this.insertNewRefreshToken(user_id, tokens[1])])

    return {
      access_token: tokens[0],
      refresh_token: tokens[1]
    }
  }

  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken(user_id)
    const result = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token: email_verify_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    return result
  }

  async createForgotPasswordToken(user_id: string) {
    const token = await this.signForgotPasswordToken(user_id)
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token: token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    return token
  }

  async verifyForgotPassword(user_id: string) {
    const result = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token: ''
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return result
  }

  async resetPassword(user_id: string, password: string) {
    const result = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(password),
          forgot_password_token: ''
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return result
  }
  async getUserById(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          created_at: 0,
          updated_at: 0,
          _id: 0
        }
      }
    )
    return user
  }
}

const usersService = new UsersServices()

export default usersService
