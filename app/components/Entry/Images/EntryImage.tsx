import type { Image } from "@prisma/client"
import SanitizedTextSpan from "../Common/SanitizedTextSpan"

type EntryImageProps = {
  image: Image
}

export function EntryImage({ image }: EntryImageProps) {
  return (
    <div className="my-5 text-center md:m-5" key={image.id}>
      <img
        className="m-3 mx-auto max-w-full border border-gray-300 shadow-md md:max-w-xl"
        src={image.path}
        alt={image.caption || "Caption unavailable"}
      />
      <h3>
        <strong>
          <SanitizedTextSpan text={image.caption} />
        </strong>
      </h3>
    </div>
  )
}
