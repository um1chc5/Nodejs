import { Request, Response } from 'express'
import { createReadStream, statSync } from 'fs'
import { OutgoingHttpHeaders } from 'http'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HttpStatusCode from '~/constants/HttpStatusCode.enum'
import { MEDIA_MESSAGES } from '~/constants/messages'
import mediaServices from '~/services/media.services'
import getMime from '~/utils/mime'

export const uploadImageController = async (req: Request, res: Response) => {
  const url = await mediaServices.uploadImage(req)
  // console.log(file)
  return res.status(200).json({
    message: MEDIA_MESSAGES.UPLOAD_IMAGE_SUCCESSFULLY,
    source: url
  })
}

export const uploadVideoController = async (req: Request, res: Response) => {
  const url = await mediaServices.uploadVideo(req)
  return res.status(200).json({
    message: MEDIA_MESSAGES.UPLOAD_IMAGE_SUCCESSFULLY,
    source: url
  })
}

export const serveStaticImage = (req: Request, res: Response) => {
  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, req.params.name), (err) => {
    if (err) {
      res.status((err as any).status).json({
        message: err.message
      })
    }
  })
}

export const serveStaticVideo = (req: Request, res: Response) => {
  return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, req.params.name), (err) => {
    if (err) {
      res.status((err as any).status).json({
        message: err.message
      })
    }
  })
}

export const serveStaticStreamingVideo = async (req: Request, res: Response) => {
  const mime = await getMime()
  const { range } = req.headers
  const { name } = req.params
  if (!range) {
    return res.status(HttpStatusCode.BAD_REQUEST).send('Require range header')
  }
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  const videoSize = statSync(videoPath).size
  const chunkSize = 10 ** 6
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + chunkSize, videoSize - 1)

  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'

  console.log('video stream', range, start, end)

  const headers: OutgoingHttpHeaders = {
    'content-range': `bytes ${start}-${end}/${videoSize}`,
    'accept-ranges': 'bytes',
    'content-length': contentLength.toString(),
    'content-type': contentType
  }

  res.writeHead(HttpStatusCode.PARTIAL_CONTENT, headers)

  const videoStream = createReadStream(videoPath, { start, end })
  videoStream.pipe(res)
}
