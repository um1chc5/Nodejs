import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetType } from '~/constants/enum'
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

export const getTweetChildrenController = async (req: Request, res: Response) => {
  const tweet_type = Number(req.query.tweet_type) as TweetType
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const user_id = req.decode_authorization.user_id

  const { tweets, total } = await tweetService.getTweetChildren({
    tweet_id: req.params.tweet_id,
    tweet_type,
    limit,
    page,
    user_id
  })

  return res.json({
    message: 'Get tweet children successfully',
    result: {
      tweets,
      tweet_type,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}
