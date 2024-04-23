import { Router } from 'express'
import { registerController } from '~/controllers/users.controlers'

const userRouter = Router()

userRouter.post('/register', registerController)
