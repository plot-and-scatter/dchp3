import { Readable } from "node:stream"
import { S3Client } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"

const {
  IMAGE_BUCKET_S3_API,
  IMAGE_BUCKET_ACCESS_KEY_ID,
  IMAGE_BUCKET_SECRET_ACCESS_KEY,
} = process.env

export const client = new S3Client({
  endpoint: IMAGE_BUCKET_S3_API!,
  credentials: {
    accessKeyId: IMAGE_BUCKET_ACCESS_KEY_ID!,
    secretAccessKey: IMAGE_BUCKET_SECRET_ACCESS_KEY!,
  },
  region: "auto",
})

export const putS3 = async (path: string, buf: Buffer, size: number) => {
  const stream = new Readable()

  stream.push(buf)
  stream.push(null)

  try {
    const parallelUploads3 = new Upload({
      client,
      queueSize: 4, // optional concurrency configuration
      leavePartsOnError: false, // optional manually handle dropped parts
      params: {
        Bucket: "dchp3",
        Key: path,
        Body: stream,
      },
    })

    await parallelUploads3.done()
  } catch (e) {
    console.error(e)
  }
}
