import { WithId } from 'mongodb'
import { IUser } from './models/schemas/User.schema'

declare module 'express' {
  interface Request {
    user?: WithId<IUser>
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_USERNAME: string
      DB_PASSWORD: string
      DB_NAME: string
      PASSWORD_SECRET: string
      JWT_SECRET: string
      ACCESS_TOKEN_EXPIRE: string
      REFRESH_TOKEN_EXPIRE: string
    }
  }
}
