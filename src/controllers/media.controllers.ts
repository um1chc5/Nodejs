import { Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { MEDIA_MESSAGES } from '~/constants/messages'
import mediaServices from '~/services/media.services'

export const uploadImageController = async (req: Request, res: Response) => {
  const url = await mediaServices.uploadImage(req)
  // console.log(file)
  return res.status(200).json({
    message: MEDIA_MESSAGES.UPLOAD_IMAGE_SUCCESSFULLY,
    source: url
  })
}

export const serveStaticImage = (req: Request, res: Response) => {
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, req.params.image), (err) => {
    if (err) {
      res.status((err as any).status).json({
        message: err.message
      })
    }
  })
}
