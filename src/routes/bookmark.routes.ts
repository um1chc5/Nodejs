import { Router } from 'express'
import { addBookmarkController, deleteBookmarkController } from '~/controllers/bookmark.controllers'
import { tweetIdValidator } from '~/middlewares/tweet.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { asyncWrapper } from '~/utils/asyncWrapper'

const bookMarkRouter = Router()

bookMarkRouter.post(
  '/',
   // #swagger.tags = ['Bookmarks']
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  asyncWrapper(addBookmarkController)
)

bookMarkRouter.delete(
  '/:tweet_id',
   // #swagger.tags = ['Bookmarks']
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  asyncWrapper(deleteBookmarkController)
)

export default bookMarkRouter
