import { WithId } from 'mongodb'
import { IUser } from './models/schemas/User.schema'
import { TokenPayload } from './models/schemas/Tokens.schema'

declare module 'express' {
  interface Request {
    user?: WithId<IUser>
    decode_email_verify_token?: TokenPayload
    decode_authorization?: TokenPayload
    decode_forgot_password_token?: TokenPayload
    decode_refresh_token?: TokenPayload
    currentPassword?: string
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_USERNAME: string
      DB_PASSWORD: string
      DB_NAME: string
      DB_USER: string
      DB_REFRESH_TOKEN: string
      DB_FOLLOWERS: string
      DB_VIDEO_STATUS_COLLECTION: string
      DB_TWEETS: string
      DB_HASHTAGS: string
      PASSWORD_SECRET: string
      JWT_SECRET_ACCESS_TOKEN: string
      JWT_SECRET_REFRESH_TOKEN: string
      JWT_EMAIL_VERIFY_TOKEN: string
      JWT_FORGOT_PASSWORD_TOKEN: string
      ACCESS_TOKEN_EXPIRE: string
      REFRESH_TOKEN_EXPIRE: string
      EMAIL_VERIFY_TOKEN_EXPIRE: string
      FORGOT_PASSWORD_TOKEN_EXPIRE: string
      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string
      GOOGLE_AUTHORIZED_REDIRECT_URI: string
      PORT: number
      HOST: string
    }
  }
}
