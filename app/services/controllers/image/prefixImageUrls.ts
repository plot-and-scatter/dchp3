import type { Entry, Image } from "@prisma/client"

type EntryWithImages = Entry & { images: Image[] }

/**
 * Prefixes the image URLs in the given entry with the IMAGE_BUCKET_PREFIX
 * environment variable.
 *
 * @param entry - The entry object containing images.
 */
export function prefixImageUrls(entry: EntryWithImages) {
  entry?.images?.forEach((i) =>
    i.path
      ? (i.path = `${process.env.IMAGE_BUCKET_PREFIX}${i.path}`)
      : undefined
  )
}
