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
    maxFileSize: 10 * 1024 * 1024,
    maxTotalFileSize: 10 * 1024 * 1024 * 4,
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
    maxFileSize: 50 * 1024 * 1024,
    maxTotalFileSize: 2 * 50 * 1024 * 1024,
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

export const getFilePaths = (dir: string, files: string[] = []) => {
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = fs.readdirSync(dir)
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    const name = `${dir}/${file}`
    // Check if the current file/directory is a directory using fs.statSync
    if (fs.statSync(name).isDirectory()) {
      // If it is a directory, recursively call the getFiles function with the directory path and the files array
      getFilePaths(name, files)
    } else {
      // If it is a file, push the full path to the files array
      files.push(name)
    }
  }
  return files
}
