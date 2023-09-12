import type { Image } from "@prisma/client"
import SanitizedTextSpan from "./SanitizedTextSpan"

const IMAGE_PATH_PREFIX = process.env.IMAGE_BUCKET_PREFIX!

type EntryImageProps = {
  image: Image
}

export function EntryImage({ image }: EntryImageProps) {
  return (
    <div className="m-5 text-center" key={image.id}>
      <img
        className="m-3 mx-auto max-w-xl"
        src={`${IMAGE_PATH_PREFIX}${image.path}`}
        alt={image.caption || "Caption unavailable"}
      />
      <h3>
        <SanitizedTextSpan text={image.caption} />
      </h3>
    </div>
  )
}
