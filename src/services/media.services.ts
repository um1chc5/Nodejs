import { Request } from 'express'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { handleUploadImage } from '~/utils/file'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { Media } from '~/models/others.mode'
import { MediaType } from '~/constants/enum'

class MediaServices {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result = await Promise.all<Media>(
      files.map(async (file) => {
        const newFilename = file.newFilename.split('.')[0]
        await sharp(file.filepath)
          .jpeg()
          .toFile(UPLOAD_IMAGE_DIR + '/' + newFilename + '.jpg')
        // fs.unlinkSync(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/${newFilename}.jpg`
            : `http://localhost:${process.env.PORT}/static/${newFilename}.jpg`,
          type: MediaType.image
        }
      })
    )
    return result
  }
}

const mediaServices = new MediaServices()

export default mediaServices
