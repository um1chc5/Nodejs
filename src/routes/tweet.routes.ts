import { Router } from 'express'
import { accessTokenValidator, isUserLoggedInValidator } from '~/middlewares/users.middlewares'
import { verifiedUserValidator } from './../middlewares/users.middlewares'
import { asyncWrapper } from '~/utils/asyncWrapper'
import {
  getNewFeedsController,
  getTweetChildrenController,
  getTweetController,
  tweetController
} from '~/controllers/tweet.controllers'
import { audienceValidator, createTweetValidator, tweetIdValidator } from '~/middlewares/tweet.middlewares'

const tweetRouter = Router()

tweetRouter.post('/', accessTokenValidator, verifiedUserValidator, createTweetValidator, asyncWrapper(tweetController))

tweetRouter.get(
  '/:tweet_id',
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  tweetIdValidator,
  audienceValidator,
  asyncWrapper(getTweetController)
)

tweetRouter.get(
  '/:tweet_id/children',
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  tweetIdValidator,
  audienceValidator,
  asyncWrapper(getTweetChildrenController)
)

tweetRouter.get(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  asyncWrapper(getNewFeedsController)
)

export default tweetRouter
