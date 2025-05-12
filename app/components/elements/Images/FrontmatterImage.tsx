type FrontmatterImageProps = {
  src: string
  alt: string
}

export default function FrontmatterImage({ src, alt }: FrontmatterImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className="my-8 w-full border border-gray-300 shadow"
    />
  )
}
