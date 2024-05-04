import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { asyncWrapper } from '~/utils/asyncWrapper'

const userRouter = Router()

userRouter.post('/login', loginValidator, asyncWrapper(loginController))

userRouter.post('/register', registerValidator, asyncWrapper(registerController))

userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, asyncWrapper(logoutController))

export default userRouter
