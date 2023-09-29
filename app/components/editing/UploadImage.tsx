import { useFetcher } from "@remix-run/react"
import type { ImageActionData } from "~/routes/api/entries/upload-file"

// Adapted substantially from https://github.com/remix-run/examples/tree/main/file-and-s3-upload
export default function UploadImage() {
  const fetcher = useFetcher<ImageActionData>()
  return (
    <>
      <div className="bg-slate-400 pt-40">
        <fetcher.Form method="post" encType="multipart/form-data">
          <label htmlFor="img-field">Image to upload</label>
          <input id="img-field" type="file" name="img" accept="image/*" />
          <label htmlFor="img-desc">Image description</label>
          <input id="img-desc" type="text" name="desc" />
          <button type="submit">Upload to S3</button>
        </fetcher.Form>
        {fetcher.type === "done" ? (
          fetcher.data.errorMsg ? (
            <h2>{fetcher.data.errorMsg}</h2>
          ) : (
            <>
              <div>
                File has been uploaded to S3 and is available under the
                following URL (if the bucket has public access enabled):
              </div>
              <div>{fetcher.data.imgSrc}</div>
              <img
                src={fetcher.data.imgSrc}
                alt={fetcher.data.imgDesc || "Uploaded image from S3"}
              />
            </>
          )
        ) : null}
      </div>
    </>
  )
}
