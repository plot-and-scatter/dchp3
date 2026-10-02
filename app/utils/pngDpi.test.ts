import { describe, expect, it } from "vitest"
import { crc32, physChunk, withPngDpi } from "./pngDpi"

const u32 = (n: number) => [
  (n >>> 24) & 0xff,
  (n >>> 16) & 0xff,
  (n >>> 8) & 0xff,
  n & 0xff,
]
const ascii = (s: string) => Array.from(s, (c) => c.charCodeAt(0))
const chunk = (type: string, data: number[]) => {
  const td = new Uint8Array([...ascii(type), ...data])
  return [...u32(data.length), ...td, ...u32(crc32(td))]
}

// A 1x1 PNG with no pixel data: enough structure to exercise the chunk walk.
const SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10]
const IHDR = chunk("IHDR", [...u32(1), ...u32(1), 8, 2, 0, 0, 0])
const IDAT = chunk("IDAT", [1, 2, 3])
const IEND = chunk("IEND", [])
const png = new Uint8Array([...SIGNATURE, ...IHDR, ...IDAT, ...IEND])

const types = (bytes: Uint8Array) => {
  const out: string[] = []
  for (let i = 8; i < bytes.length; ) {
    const len =
      ((bytes[i] << 24) |
        (bytes[i + 1] << 16) |
        (bytes[i + 2] << 8) |
        bytes[i + 3]) >>>
      0
    out.push(String.fromCharCode(...bytes.subarray(i + 4, i + 8)))
    i += 12 + len
  }
  return out
}

describe("crc32", () => {
  it("matches the PNG spec's CRC for an empty IEND chunk", () => {
    expect(crc32(new Uint8Array(ascii("IEND")))).toBe(0xae426082)
  })
})

describe("physChunk", () => {
  it("records 300 dpi as 11811 pixels per metre on both axes", () => {
    const c = physChunk(300)
    expect([...c.subarray(0, 4)]).toEqual(u32(9))
    expect(String.fromCharCode(...c.subarray(4, 8))).toBe("pHYs")
    expect([...c.subarray(8, 12)]).toEqual(u32(11811))
    expect([...c.subarray(12, 16)]).toEqual(u32(11811))
    expect(c[16]).toBe(1)
    expect(c.length).toBe(21)
  })
})

describe("withPngDpi", () => {
  it("inserts pHYs directly after IHDR and keeps everything else", () => {
    const out = withPngDpi(png, 300)
    expect(types(out)).toEqual(["IHDR", "pHYs", "IDAT", "IEND"])
    expect(out.length).toBe(png.length + 21)
    expect([...out.subarray(0, 8)]).toEqual(SIGNATURE)
  })

  it("replaces an existing pHYs instead of adding a second", () => {
    const once = withPngDpi(png, 72)
    const twice = withPngDpi(once, 300)
    expect(types(twice)).toEqual(["IHDR", "pHYs", "IDAT", "IEND"])
    expect([
      ...twice.subarray(8 + IHDR.length + 8, 8 + IHDR.length + 12),
    ]).toEqual(u32(11811))
  })

  it("leaves bytes that are not a PNG alone", () => {
    const junk = new Uint8Array([1, 2, 3, 4])
    expect(withPngDpi(junk, 300)).toBe(junk)
  })

  it("accepts an ArrayBuffer, as canvas.toBlob().arrayBuffer() gives", () => {
    const out = withPngDpi(png.buffer.slice(0), 300)
    expect(types(out)).toEqual(["IHDR", "pHYs", "IDAT", "IEND"])
  })
})
