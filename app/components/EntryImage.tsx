import type { Image } from "@prisma/client"
import SanitizedTextSpan from "./SanitizedTextSpan"

type EntryImageProps = {
  image: Image
}

export function EntryImage({ image }: EntryImageProps) {
  return (
    <div className="m-5 text-center" key={image.id}>
      <img
        className="m-3 mx-auto max-w-xl"
        src={image.path}
        alt={image.caption || "Caption unavailable"}
      />
      <h3>
        <SanitizedTextSpan text={image.caption} />
      </h3>
    </div>
  )
}
