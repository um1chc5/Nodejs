import { Bucket, paginateListBuckets, S3Client, S3ServiceException } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { readFileSync } from 'fs'
import path from 'path'
import getMime from './mime'

let buckets: Bucket[] = []

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

export const helloS3 = async () => {
  // When no region or credentials are provided, the SDK will use the
  // region and credentials from the local AWS config.

  // reset buckets
  buckets = []

  try {
    for await (const page of paginateListBuckets({ client: s3Client }, {})) {
      buckets.push(...page.Buckets)
    }
    console.log('Init buckets', buckets)
    return buckets
  } catch (caught) {
    // ListBuckets does not throw any modeled errors. Any error caught
    // here will be something generic like `AccessDenied`.
    if (caught instanceof S3ServiceException) {
      console.error(`${caught.name}: ${caught.message}`)
    } else {
      // Something besides S3 failed.
      throw caught
    }
  }
}

export const uploadFileToS3 = async ({
  name,
  filePath,
  mimeType
}: {
  name: string
  filePath: string
  mimeType: string
}) => {
  if (!buckets[0].Name) return

  try {
    const file = readFileSync(filePath)
    const mime = await getMime()
    console.log(mimeType)
    const parallelUploads3 = new Upload({
      client: s3Client,
      params: {
        Bucket: buckets[0].Name,
        Key: name,
        Body: file,
        ContentType: mimeType
      },
      // additional optional fields show default values below:

      // (optional) concurrency configuration
      queueSize: 4,

      // (optional) size of each part, in bytes, at least 5MB
      partSize: 1024 * 1024 * 5,

      // (optional) when true, do not automatically call AbortMultipartUpload when
      // a multipart upload fails to complete. You should then manually handle
      // the leftover parts.
      leavePartsOnError: false
    })
    parallelUploads3.on('httpUploadProgress', (progress) => {
      console.log((progress.loaded / progress.total) * 100 + '%')
    })

    return await parallelUploads3.done()
  } catch (error) {
    console.log(error)
  }
}

// initialize s3 Client Instance
helloS3()
