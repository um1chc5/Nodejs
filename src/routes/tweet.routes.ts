import { Router } from 'express'
import { accessTokenValidator, isUserLoggedInValidator } from '~/middlewares/users.middlewares'
import { verifiedUserValidator } from './../middlewares/users.middlewares'
import { asyncWrapper } from '~/utils/asyncWrapper'
import { getTweetController, tweetController } from '~/controllers/tweet.controllers'
import { audienceValidator, createTweetValidator, tweetIdValidator } from '~/middlewares/tweet.middlewares'

const tweetRouter = Router()

tweetRouter.post('/', accessTokenValidator, verifiedUserValidator, createTweetValidator, asyncWrapper(tweetController))

tweetRouter.get(
  '/:tweet_id',
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  tweetIdValidator,
  audienceValidator,
  getTweetController
)

export default tweetRouter
