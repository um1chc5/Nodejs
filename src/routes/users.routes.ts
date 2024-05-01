import { Router } from 'express'
import { registerController } from '~/controllers/users.controllers'
import { registerValidator } from '~/middlewares/users.middlewares'
import { asyncWrapper } from '~/utils/asyncWrapper'

const userRouter = Router()

userRouter.post('/register', registerValidator, asyncWrapper(registerController))

export default userRouter
