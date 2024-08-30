import { JwtPayload } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { TokenTypes, UserVerifyStatus } from '~/constants/enum'

interface IRefreshToken {
  _id?: ObjectId
  token: string
  created_at?: Date
  user_id: ObjectId
  exp: number
  iat: number
}

export class RefreshToken {
  _id?: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId
  exp: Date
  iat: Date

  constructor({ _id, created_at, token, user_id, exp, iat }: IRefreshToken) {
    this._id = _id
    this.created_at = created_at || new Date()
    this.token = token
    this.user_id = user_id
    this.exp = new Date(exp * 1000)
    this.iat = new Date(iat * 1000)
  }
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenTypes
  verify: UserVerifyStatus
}
