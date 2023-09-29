import type { ActionArgs, UploadHandler } from "@remix-run/node"
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node"
import UploadImage from "~/components/editing/UploadImage"

import { s3UploadHandler } from "~/services/upload/uploadToR2.server"

export type ImageActionData = {
  errorMsg?: string
  imgSrc?: string
  imgDesc?: string
}

export const action = async ({ request }: ActionArgs) => {
  const uploadHandler: UploadHandler = composeUploadHandlers(
    s3UploadHandler,
    createMemoryUploadHandler()
  )
  const formData = await parseMultipartFormData(request, uploadHandler)
  const imgSrc = formData.get("img")
  const imgDesc = formData.get("desc")
  console.log(imgDesc)
  if (!imgSrc) {
    return json({
      errorMsg: "Something went wrong while uploading",
    })
  }
  return json({
    imgSrc,
    imgDesc,
  })
}

export default function Index() {
  return (
    <div className="mt-96 bg-slate-50">
      <UploadImage />
    </div>
  )
}
