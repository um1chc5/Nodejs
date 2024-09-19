import { Router } from 'express'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { verifiedUserValidator } from './../middlewares/users.middlewares'
import { asyncWrapper } from '~/utils/asyncWrapper'
import { tweetController } from '~/controllers/tweet.controllers'
import { createTweetValidator } from '~/middlewares/tweet.middlewares'

const tweetRouter = Router()

tweetRouter.post('/', accessTokenValidator, verifiedUserValidator, createTweetValidator, asyncWrapper(tweetController))

export default tweetRouter
