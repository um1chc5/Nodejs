import { config } from 'dotenv'
import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/user.requests'

config()

interface SignTokenParams {
  payload: string | Buffer | object
  privateKey: string
  options?: SignOptions
}

export const signToken = ({ payload, privateKey, options = { algorithm: 'HS256' } }: SignTokenParams) => {
  return new Promise<string>((resolve, reject) =>
    sign(payload, privateKey, options, (error, token) => {
      if (error) reject(error)
      if (token) resolve(token)
    })
  )
}

interface VerifyTokenParams {
  token: string
  secretOrPublicKey: string
}

export const verifyToken = ({ token, secretOrPublicKey }: VerifyTokenParams) => {
  return new Promise<TokenPayload>((resolve, reject) =>
    verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) reject(error)
      if (decoded) resolve(decoded as TokenPayload)
    })
  )
}
