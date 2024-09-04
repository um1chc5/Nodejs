import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { verifiedUserValidator } from './../middlewares/users.middlewares'
import { asyncWrapper } from '~/utils/asyncWrapper'
import { tweetController } from '~/controllers/tweet.controllers'

const tweetRouter = Router()

tweetRouter.post('/', accessTokenValidator, verifiedUserValidator, asyncWrapper(tweetController))

export default tweetRouter
