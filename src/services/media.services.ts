import { Request } from 'express'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { handleUploadImage } from '~/utils/file'
import fs from 'fs'

class MediaServices {
  async uploadImage(req: Request) {
    const file = await handleUploadImage(req)
    const newFilename = file.newFilename.split('.')[0]
    const result = await sharp(file.filepath)
      .jpeg()
      .toFile(UPLOAD_IMAGE_DIR + '/' + newFilename + '.jpg')
    fs.unlinkSync(file.filepath)
    return result
  }
}

const mediaServices = new MediaServices()

export default mediaServices
