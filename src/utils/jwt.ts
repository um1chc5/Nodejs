import { config } from 'dotenv'
import { sign, SignOptions } from 'jsonwebtoken'

config()

interface SignTokenParams {
  payload: string | Buffer | object
  privateKey?: string
  options?: SignOptions
}

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: SignTokenParams) => {
  return new Promise<string>((resolve, reject) =>
    sign(payload, privateKey, options, (error, token) => {
      if (error) reject(error)
      if (token) resolve(token)
    })
  )
}
