import { PassThrough } from "stream"

import type { UploadHandler } from "@remix-run/node"
import { writeAsyncIterableToWritable } from "@remix-run/node"
import AWS from "aws-sdk"

// const { STORAGE_ACCESS_KEY, STORAGE_SECRET } = process.env

// if (!(STORAGE_ACCESS_KEY && STORAGE_SECRET)) {
//   throw new Error(`Storage is missing required configuration.`)
// }

const uploadStream = ({ Key }: Pick<AWS.S3.Types.PutObjectRequest, "Key">) => {
  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: `36e11492fd9a0df593e8f6d04181d5f0`,
      secretAccessKey: `44f61caefbde4641eedc9d951c6d50be80e1deab49d83cf8e42b117ccbade584`,
    },
    region: `auto`,
  })
  const pass = new PassThrough()
  return {
    writeStream: pass,
    promise: s3.upload({ Bucket: "dchp", Key, Body: pass }).promise(),
  }
}

export async function uploadStreamToS3(data: any, filename: string) {
  const stream = uploadStream({
    Key: filename,
  })
  await writeAsyncIterableToWritable(data, stream.writeStream)
  const file = await stream.promise
  return file.Location
}

export const s3UploadHandler: UploadHandler = async ({
  name,
  filename,
  data,
}) => {
  if (name !== "img") {
    return undefined
  }
  const uploadedFileLocation = await uploadStreamToS3(data, filename!)
  return uploadedFileLocation
}
