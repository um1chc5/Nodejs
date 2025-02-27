import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetRequestBody } from '~/models/requests/tweet.request'
import tweetService from '~/services/tweet.services'

export const tweetController = async (req: Request<ParamsDictionary, unknown, TweetRequestBody>, res: Response) => {
  const { user_id } = req.decode_authorization
  const result = await tweetService.createTweet(req.body, user_id)
  return res.json({
    message: 'Create tweet successfully',
    result
  })
}

export const getTweetController = async (req: Request, res: Response) => {
  const result = await tweetService.increaseView(req.params.tweet_id, req.decode_authorization?.user_id)
  return res.json({
    message: 'Get tweet successfully',
    result: req.tweet
  })
}
