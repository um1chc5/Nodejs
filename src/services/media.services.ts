import { Request } from 'express'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { handleUploadImage, handleUploadVideo } from '~/utils/file'
import { isProduction } from '~/constants/config'
import { Media } from '~/models/others.mode'
import { MediaType } from '~/constants/enum'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/hls'
import { promises as fsPromise } from 'fs'

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
            : `http://localhost:${process.env.PORT}/static/images/${newFilename}.jpg`,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const { newFilename } = file
        return {
          url: isProduction
            ? `${process.env.HOST}/static/${newFilename}`
            : `http://localhost:${process.env.PORT}/static/videos/${newFilename}`,
          type: MediaType.Video
        }
      })
    )
    return result
  }

  async uploadVideoHLS(req: Request) {
    const files = await handleUploadVideo(req)

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        await encodeHLSWithMultipleVideoStreams(file.filepath)
        await fsPromise.unlink(file.filepath)
        const { newFilename } = file

        return {
          url: isProduction
            ? `${process.env.HOST}/static/${newFilename}`
            : `http://localhost:${process.env.PORT}/static/video-hls/${newFilename}`,
          type: MediaType.Video
        }
      })
    )
    return result
  }
}

const mediaServices = new MediaServices()

export default mediaServices
