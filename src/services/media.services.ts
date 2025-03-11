import { Request } from 'express'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { getNameFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/file'
import { isProduction } from '~/constants/config'
import { Media } from '~/models/others.mode'
import { EncodingStatus, MediaType } from '~/constants/enum'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/hls'
import { promises as fsPromise, unlinkSync } from 'fs'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
import path from 'path'
import { uploadFileToS3 } from '~/utils/s3'

// Mongodb video status services

class MediaServices {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result = await Promise.all<Media>(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename.split('.')[0])
        const outputPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)

        try {
          // Convert image using Sharp
          sharp.cache(false)
          const jpeg = sharp(file.filepath).jpeg()
          await jpeg.toFile(outputPath)

          const s3UploadResult = await uploadFileToS3({
            name: file.newFilename,
            filePath: outputPath,
            mimeType: file.mimetype
          })

          // Safely delete the temporary file after processing
          await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(outputPath)])

          return {
            url: s3UploadResult.Location,
            type: MediaType.Image
          }
        } catch (error) {
          console.error('Error processing image:', error)
          throw error
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
