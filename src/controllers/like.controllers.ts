import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LIKE_MESSAGES } from '~/constants/messages'
import { LikeTweetReqBody } from '~/models/requests/like.request'
import likeServices from '~/services/like.services'

export const addLikeController = async (req: Request<ParamsDictionary, unknown, LikeTweetReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization
  const { tweet_id } = req.body

  await likeServices.addLike(user_id, tweet_id)

  return res.status(200).json({
    message: LIKE_MESSAGES.ADD_LIKE_SUCCESSFULLY
  })
}

export const unlikeController = async (req: Request<{ tweet_id: string }>, res: Response) => {
  const { user_id } = req.decode_authorization
  const { tweet_id } = req.params

  await likeServices.unLike(user_id, tweet_id)

  return res.status(200).json({
    message: LIKE_MESSAGES.UNLIKE_SUCCESSFULLY
  })
}
