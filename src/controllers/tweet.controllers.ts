import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetRequestBody } from '~/models/requests/tweet.request'

export const tweetController = (req: Request<ParamsDictionary, unknown, TweetRequestBody>, res: Response) => {
  return res.status(200).json('heheheh')
}
