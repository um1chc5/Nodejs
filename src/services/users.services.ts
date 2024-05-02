import { IUser, User } from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterRequestBody } from '~/models/requests/user.requests'
import { hashPassword } from '~/utils/encrypt'
import { signToken } from '~/utils/jwt'
import { TokenTypes } from '~/constants/enum'
import { ObjectId, WithId } from 'mongodb'
import { RefreshToken } from '~/models/schemas/Tokens.schema'
import { config } from 'dotenv'

config()

class UsersServices {
  private signAccessToken(userId: string) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenTypes.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE
      }
    })
  }
  private signRefreshToken(userId: string) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenTypes.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE
      }
    })
  }

  private generateTokens(userId: string) {
    return Promise.all([this.signAccessToken(userId), this.signRefreshToken(userId)])
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
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.generateTokens(user_id)

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
}

const usersService = new UsersServices()

export default usersService
