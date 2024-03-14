import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"

import { Readable } from "node:stream"

const {
  IMAGE_BUCKET_S3_API,
  IMAGE_BUCKET_ACCESS_KEY_ID,
  IMAGE_BUCKET_SECRET_ACCESS_KEY,
} = process.env

// console.log("IMAGE_BUCKET_S3_API", IMAGE_BUCKET_S3_API)
// console.log("IMAGE_BUCKET_ACCESS_KEY_ID", IMAGE_BUCKET_ACCESS_KEY_ID)
// console.log("IMAGE_BUCKET_SECRET_ACCESS_KEY", IMAGE_BUCKET_SECRET_ACCESS_KEY)

export const client = new S3Client({
  endpoint: IMAGE_BUCKET_S3_API!,
  credentials: {
    accessKeyId: IMAGE_BUCKET_ACCESS_KEY_ID!,
    secretAccessKey: IMAGE_BUCKET_SECRET_ACCESS_KEY!,
  },
  region: "auto",
})

export const helloS3 = async () => {
  const command = new ListBucketsCommand({})

  const foo = await client.send(command)

  console.log(foo)
}

export const putS3 = async (path: string, buf: Buffer, size: number) => {
  const stream = new Readable()

  stream.push(buf)
  stream.push(null)

  // const command = new PutObjectCommand({
  //   Bucket: "dchp3",
  //   Key: "uploads/zendaya.jpg",
  //   Body: stream,
  // })

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

    parallelUploads3.on("httpUploadProgress", (progress) => {
      console.log(progress)
    })

    await parallelUploads3.done()
  } catch (e) {
    console.log(e)
  }
}
