import { Router } from 'express'
import { getConversation } from '~/controllers/conversation.controllers'
import { conversationValidator } from '~/middlewares/conversation.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { asyncWrapper } from '~/utils/asyncWrapper'

const conversationRouter = Router()

conversationRouter.get(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  conversationValidator,
  asyncWrapper(getConversation)
)

export default conversationRouter
