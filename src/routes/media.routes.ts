import { Router } from 'express'
import { uploadImageController, uploadVideoController, uploadVideoHLSController } from '~/controllers/media.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { asyncWrapper } from '~/utils/asyncWrapper'

const mediaRouter = Router()

mediaRouter.post(
  '/upload-image',
  // #swagger.tags = ['Media']
  accessTokenValidator,
  asyncWrapper(uploadImageController)
)

mediaRouter.post(
  '/upload-video',
  // #swagger.tags = ['Media']
  accessTokenValidator,
  asyncWrapper(uploadVideoController)
)

mediaRouter.post(
  '/upload-video-hls',
  // #swagger.tags = ['Media']
  accessTokenValidator,
  asyncWrapper(uploadVideoHLSController)
)

export default mediaRouter
