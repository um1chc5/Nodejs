import { WithId } from 'mongodb'
import { IUser } from './models/schemas/User.schema'
import { TokenPayload } from './models/requests/user.requests'

declare module 'express' {
  interface Request {
    user?: WithId<IUser>
    decode_email_verify_token?: TokenPayload
    decode_authorization?: TokenPayload
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_USERNAME: string
      DB_PASSWORD: string
      DB_NAME: string
      PASSWORD_SECRET: string
      JWT_SECRET_ACCESS_TOKEN: string
      JWT_SECRET_REFRESH_TOKEN: string
      JWT_EMAIL_VERIFY_TOKEN: string
      ACCESS_TOKEN_EXPIRE: string
      REFRESH_TOKEN_EXPIRE: string
      EMAIL_VERIFY_TOKEN_EXPIRE: string
    }
  }
}
