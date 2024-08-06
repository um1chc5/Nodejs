import { Router } from 'express'
import { uploadImageController, uploadVideoController } from '~/controllers/media.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { asyncWrapper } from '~/utils/asyncWrapper'

const mediaRouter = Router()

mediaRouter.post('/upload-image', accessTokenValidator, asyncWrapper(uploadImageController))

mediaRouter.post('/upload-video', accessTokenValidator, asyncWrapper(uploadVideoController))

export default mediaRouter
