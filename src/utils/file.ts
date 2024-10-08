import { Request } from 'express'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import fs from 'fs'
import { File } from 'formidable'
import path from 'path'

export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      })
    }
  })
}

export const handleUploadImage = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 5000 * 1024,
    maxTotalFileSize: 5000 * 1024 * 4,
    filter: function ({ name, mimetype }) {
      const valid = name === 'image' || mimetype?.includes('image/')
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return Boolean(valid)
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      if (files.image?.length === 0) {
        console.log('reject')
        return reject(new Error('File is Empty'))
      }
      resolve(files.image as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request, type: 'hls' | 'static-stream' = 'static-stream') => {
  const formidable = (await import('formidable')).default
  const nanoid = (await import('nanoid')).nanoid
  const idName = nanoid()
  const folderPath = type === 'hls' ? path.resolve(UPLOAD_VIDEO_DIR, idName) : path.resolve(UPLOAD_VIDEO_DIR)

  if (type === 'hls') {
    fs.mkdirSync(folderPath)
  }

  const form = formidable({
    uploadDir: folderPath,
    maxFiles: 4,
    keepExtensions: true,
    maxFileSize: 30 * 1024 * 1024,
    maxTotalFileSize: 4 * 30 * 1024 * 1024,
    filter: function ({ name, mimetype }) {
      const valid = name === 'video' || mimetype?.includes('mp4') || mimetype?.includes('quicktime')
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return Boolean(valid)
    },
    filename: function (_, ext) {
      return idName + ext
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      if (files.video?.length === 0) {
        console.log('reject')
        return reject(new Error('File is Empty'))
      }
      resolve(files.video as File[])
    })
  })
}

export const getNameFromFullName = (name: string) => name.split('.')[0]
