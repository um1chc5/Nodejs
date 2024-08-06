import { Request } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR } from '~/constants/dir'
import fs from 'fs'
import { File } from 'formidable'

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_IMAGE_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_IMAGE_TEMP_DIR, {
      recursive: true
    })
  }
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

  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      console.log(files.image)
      if (!files.image || files.image?.length === 0) {
        console.log('reject')
        return reject(new Error('File is Empty'))
      }
      resolve(files.image[0] as unknown as File)
    })
  })
}
