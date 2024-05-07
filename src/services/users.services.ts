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
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE
      },
      privateKey: process.env.JWT_EMAIL_VERIFY_TOKEN
    })
  }

  private generateTokens(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
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
    const result = await databaseService.refreshToken.deleteOne({ token: refresh_token })
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
    return {
      access_token: tokens[0],
      refresh_token: tokens[1]
    }
  }
}

const usersService = new UsersServices()

export default usersService
