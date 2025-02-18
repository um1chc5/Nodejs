import { Router } from 'express'
import { addLikeController, unlikeController } from '~/controllers/like.controllers'
import { bookmarkValidator } from '~/middlewares/bookmark.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const likeRouter = Router()

likeRouter.post('/', accessTokenValidator, verifiedUserValidator, bookmarkValidator, addLikeController)

likeRouter.delete('/:tweet_id', accessTokenValidator, verifiedUserValidator, unlikeController)

export default likeRouter
