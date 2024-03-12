import type { Image } from "@prisma/client"
import SanitizedTextSpan from "../Entry/Common/SanitizedTextSpan"

type EntryImageProps = {
  image: Image
}

export function EntryImage({ image }: EntryImageProps) {
  return (
    <div className="m-5 text-center" key={image.id}>
      <img
        className="m-3 mx-auto max-w-xl border border-gray-300 shadow-md"
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
