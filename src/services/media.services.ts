import { Request } from 'express'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { getNameFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/file'
import { isProduction } from '~/constants/config'
import { Media } from '~/models/others.mode'
import { EncodingStatus, MediaType } from '~/constants/enum'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/hls'
import { promises as fsPromise } from 'fs'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.schema'

// Mongodb video status services

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
    const files = await handleUploadVideo(req, 'static-stream')
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
    const files = await handleUploadVideo(req, 'hls')

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        videoEncodingQueue.enqueue(file.filepath)
        const newFilename = file.newFilename.split('.')[0]

        return {
          url: isProduction
            ? `${process.env.HOST}/static/${newFilename}`
            : `http://localhost:${process.env.PORT}/static/video-hls/${newFilename}/`,
          type: MediaType.Video
        }
      })
    )
    return result
  }
}

class VideoStatusServices {
  async enqueue(name: string) {
    await databaseService.videoStatus
      .insertOne(
        new VideoStatus({
          name: name,
          status: EncodingStatus.Pending
        })
      )
      .then((err) => {
        console.log(err)
      })
  }

  async updateStatus(name: string, status: EncodingStatus, message?: string) {
    await databaseService.videoStatus
      .updateOne(
        {
          name
        },
        {
          $set: {
            status,
            message: message || ''
          },
          $currentDate: { updated_at: true }
        }
      )
      .then((err) => {
        console.log(err)
      })
  }
}

const videoStatusServices = new VideoStatusServices()

class EncodingQueue {
  private videoQueue: string[]
  private encoding: boolean

  constructor() {
    this.videoQueue = []
    this.encoding = false
  }

  enqueue(filePath: string) {
    this.videoQueue.push(filePath)

    // enqueue to mongodb collection
    const idName = getNameFromFullName(filePath.split('\\').pop())
    videoStatusServices.enqueue(idName)
    console.log(idName)

    if (!this.encoding) {
      this.encoding = true
      this.processEncoding()
    }
  }

  private processEncoding() {
    if (this.videoQueue.length === 0) {
      this.encoding = false
      return
    }

    const filePath = this.videoQueue.shift()

    // Update db status to encoding
    const idName = getNameFromFullName(filePath.split('\\').pop())
    videoStatusServices.updateStatus(idName, EncodingStatus.Encoding)

    // start encoding
    encodeHLSWithMultipleVideoStreams(filePath)
      .then(async () => {
        console.log('HLS encoding done:', filePath)

        // Update db status to success
        await videoStatusServices.updateStatus(idName, EncodingStatus.Success)

        // Delete raw video file
        await fsPromise.unlink(filePath)

        // Encode next video in queue
        this.processEncoding()
      })
      .catch((error) => {
        console.error('Error while encoding:', error)
        // Update db status to failed
        videoStatusServices.updateStatus(idName, EncodingStatus.Failed)
        // Encode next video in queue
      })
      .finally(() => {
        this.processEncoding()
      })
  }
}

const videoEncodingQueue = new EncodingQueue()

const mediaServices = new MediaServices()

export default mediaServices
