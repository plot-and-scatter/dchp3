import { describe, expect, it } from "vitest"
import { legacyPathRedirect } from "./legacyPaths"

const DCHP1_PAGES = ["home", "history", "how-to-use", "copyright-notice"]
const DCHP2_PAGES = ["home", "history", "how-to-use", "foreword"]

const dchp1 = (path: string) => legacyPathRedirect(path, "dchp1", DCHP1_PAGES)
const dchp2 = (path: string) => legacyPathRedirect(path, "dchp2", DCHP2_PAGES)

describe("legacyPathRedirect", () => {
  it("sends an old entry address to the entry", () => {
    expect(dchp2("/Entries/view/toque")).toBe("/entries/toque")
    expect(dchp2("/entries/view/toque")).toBe("/entries/toque")
    expect(dchp1("/Entries/view/Red%20Ensign")).toBe("/entries/Red%20Ensign")
    expect(dchp1("/entries/edit/sage%20cock")).toBe("/entries/sage%20cock")
  })

  it("keeps a headword's capitals, encoding and inner slashes", () => {
    expect(dchp1("/Entries/view/Canuck%20((n.))")).toBe(
      "/entries/Canuck%20((n.))"
    )
    expect(dchp2("/ENTRIES/VIEW/First%20Nation")).toBe(
      "/entries/First%20Nation"
    )
    expect(dchp2("/Entries/view/24/7")).toBe("/entries/24/7")
  })

  it("sends the old browse pages to their replacements", () => {
    expect(dchp1("/Browse/view/A")).toBe("/entries/browse/A/1")
    expect(dchp1("/browse/view/q")).toBe("/entries/browse/Q/1")
    expect(dchp2("/Browse/view/NonCanadian")).toBe("/entries")
    expect(dchp1("/Browse/welcome")).toBe("/")
    expect(dchp1("/Browse/welcome/1")).toBe("/")
    expect(dchp1("/Browse/wordoftheday")).toBe("/")
    expect(dchp2("/Browse/welcome/")).toBe("/")
  })

  it("sends the old home, search and reference pages to their replacements", () => {
    expect(dchp2("/pages/welcome")).toBe("/")
    expect(dchp2("/pages/")).toBe("/")
    expect(dchp1("/index.htm")).toBe("/")
    expect(dchp2("/Search/advanced/")).toBe("/search")
    expect(dchp1("/Search/results")).toBe("/search")
    expect(dchp2("/References/listing/")).toBe("/references")
  })

  it("renames a front-matter page only where the edition has the new page", () => {
    expect(dchp1("/pages/copyrightnotice")).toBe("/pages/copyright-notice")
    expect(dchp2("/pages/copyrightnotice")).toBeUndefined()
  })

  it("leaves every current address alone", () => {
    for (const path of [
      "/",
      "/entries",
      "/entries/toque",
      "/entries/view",
      "/entries/browse/A/1",
      "/search",
      "/references",
      "/references/12",
      "/pages/home",
      "/pages/foreword",
      "/pages/copyright-notice",
      "/how-to-use",
    ]) {
      expect(dchp1(path)).toBeUndefined()
      expect(dchp2(path)).toBeUndefined()
    }
  })

  it("does nothing on DCHP-3", () => {
    expect(
      legacyPathRedirect("/Entries/view/toque", "dchp3", ["home"])
    ).toBeUndefined()
  })
})
