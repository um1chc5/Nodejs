import { Router } from 'express'
import { addLikeController, unlikeController } from '~/controllers/like.controllers'
import { tweetIdValidator } from '~/middlewares/tweet.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const likeRouter = Router()

likeRouter.post(
  '/',
  // #swagger.tags = ['Like']
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  addLikeController
)

likeRouter.delete(
  '/:tweet_id',
  // #swagger.tags = ['Like']
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  unlikeController
)

export default likeRouter
