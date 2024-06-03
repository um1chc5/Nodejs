import { Router } from 'express'
import { uploadImageController } from '~/controllers/media.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { asyncWrapper } from '~/utils/asyncWrapper'

const mediaRouter = Router()

mediaRouter.post('/upload-image', accessTokenValidator, asyncWrapper(uploadImageController))

export default mediaRouter
