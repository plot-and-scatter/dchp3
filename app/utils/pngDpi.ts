// Stamp a resolution on a PNG so Word and image editors open it at the
// intended physical size. Browsers' canvas.toBlob writes no pHYs chunk, so a
// 1654 px image lands in Word at 96 dpi as 44 cm wide; with 300 dpi recorded
// it lands at the 14 cm the DCHP-2 chart guide asks for.
//
// PNG is a signature followed by chunks of length, type, data and a CRC-32
// over type and data. pHYs holds pixels per unit on each axis and a unit flag
// (1 = metre). It must come after IHDR, which is always the first chunk.

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

export const crc32 = (bytes: Uint8Array) => {
  let crc = 0xffffffff
  for (const b of bytes) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

const SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10]
const IHDR_END = 8 + 4 + 4 + 13 + 4

const u32 = (n: number) => [
  (n >>> 24) & 0xff,
  (n >>> 16) & 0xff,
  (n >>> 8) & 0xff,
  n & 0xff,
]

const ascii = (s: string) => Array.from(s, (c) => c.charCodeAt(0))

export const physChunk = (dpi: number) => {
  const perMetre = Math.round(dpi / 0.0254)
  const typeAndData = new Uint8Array([
    ...ascii("pHYs"),
    ...u32(perMetre),
    ...u32(perMetre),
    1,
  ])
  return new Uint8Array([...u32(9), ...typeAndData, ...u32(crc32(typeAndData))])
}

/** Chunks of a PNG after the signature, as [type, start, end) spans. */
const chunkSpans = (png: Uint8Array) => {
  const spans: { type: string; start: number; end: number }[] = []
  let i = 8
  while (i + 8 <= png.length) {
    const length =
      ((png[i] << 24) | (png[i + 1] << 16) | (png[i + 2] << 8) | png[i + 3]) >>>
      0
    const type = String.fromCharCode(...png.subarray(i + 4, i + 8))
    const end = i + 12 + length
    spans.push({ type, start: i, end })
    i = end
  }
  return spans
}

export const withPngDpi = (png: ArrayBuffer | Uint8Array, dpi: number) => {
  const bytes = png instanceof Uint8Array ? png : new Uint8Array(png)
  const isPng = SIGNATURE.every((b, i) => bytes[i] === b)
  if (!isPng || bytes.length < IHDR_END) return bytes

  // Drop any pHYs already there rather than leave two.
  const keep = chunkSpans(bytes).filter((c) => c.type !== "pHYs")
  const phys = physChunk(dpi)
  const total =
    8 + keep.reduce((n, c) => n + (c.end - c.start), 0) + phys.length
  const out = new Uint8Array(total)
  out.set(bytes.subarray(0, 8), 0)
  let at = 8
  for (const c of keep) {
    out.set(bytes.subarray(c.start, c.end), at)
    at += c.end - c.start
    if (c.type === "IHDR") {
      out.set(phys, at)
      at += phys.length
    }
  }
  return out
}
