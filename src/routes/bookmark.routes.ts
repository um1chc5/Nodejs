import { Router } from 'express'
import { addBookmarkController, deleteBookmarkController } from '~/controllers/bookmark.controllers'
import { tweetIdValidator } from '~/middlewares/tweet.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { asyncWrapper } from '~/utils/asyncWrapper'

const bookMarkRouter = Router()

bookMarkRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  asyncWrapper(addBookmarkController)
)

bookMarkRouter.delete(
  '/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  asyncWrapper(deleteBookmarkController)
)

export default bookMarkRouter
