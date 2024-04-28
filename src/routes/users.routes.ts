import { Router } from 'express'
import { registerController } from '~/controllers/users.controllers'
import { registerValidator } from '~/middlewares/users.middlewares'

const userRouter = Router()

userRouter.post('/register', registerValidator, registerController)

export default userRouter
