type FrontmatterImageProps = {
  src: string
  alt: string
  // Render in the run of text (a small glyph such as the fist-note hand)
  // rather than as a block of its own.
  inline?: boolean
}

// Shown at natural size and never enlarged: the archive pages carry small
// screenshots from the 2013 and 2017 sites (300 to 600px wide), which went
// blurry when stretched to the column (issue 521). Images wider than the
// column still shrink to fit, so DCHP-3's large screenshots look as before.
export default function FrontmatterImage({
  src,
  alt,
  inline,
}: FrontmatterImageProps) {
  if (inline) {
    return <img src={src} alt={alt} className="inline h-[1.2em] w-auto" />
  }
  return (
    <img
      src={src}
      alt={alt}
      className="mx-auto my-8 h-auto max-w-full border border-gray-300 shadow"
    />
  )
}
