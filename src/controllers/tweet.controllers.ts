import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetRequestBody } from '~/models/requests/tweet.request'
import tweetService from '~/services/tweet.services'

export const tweetController = (req: Request<ParamsDictionary, unknown, TweetRequestBody>, res: Response) => {
  const result = tweetService.createTweet(req.body)
  return res.json({
    message: 'Create tweet successfully',
    result
  })
}
