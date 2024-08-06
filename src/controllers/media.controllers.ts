import { Request, Response } from 'express'
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
