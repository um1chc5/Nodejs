import { Router } from 'express'
import { addBookmarkController, deleteBookmarkController } from '~/controllers/bookmark.controllers'
import { bookmarkValidator } from '~/middlewares/bookmark.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { asyncWrapper } from '~/utils/asyncWrapper'

const bookMarkRouter = Router()

bookMarkRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  bookmarkValidator,
  asyncWrapper(addBookmarkController)
)

bookMarkRouter.delete('/:tweet_id', accessTokenValidator, verifiedUserValidator, asyncWrapper(deleteBookmarkController))

export default bookMarkRouter
