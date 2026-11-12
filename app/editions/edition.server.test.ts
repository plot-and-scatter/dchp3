import { describe, it, expect, afterEach } from "vitest"
import {
  getEditionId,
  isArchive,
  throwIfPathBlockedInArchive,
} from "./edition.server"
import { isPathBlockedInArchive } from "./edition"

const original = process.env.DCHP_EDITION

const setEdition = (value: string | undefined) => {
  if (value === undefined) delete process.env.DCHP_EDITION
  else process.env.DCHP_EDITION = value
}

afterEach(() => setEdition(original))

describe("getEditionId", () => {
  it("defaults to dchp3 when DCHP_EDITION is unset or empty", () => {
    setEdition(undefined)
    expect(getEditionId()).toBe("dchp3")
    expect(isArchive()).toBe(false)
    setEdition("")
    expect(getEditionId()).toBe("dchp3")
  })

  it("reads a valid edition", () => {
    setEdition("dchp1")
    expect(getEditionId()).toBe("dchp1")
    expect(isArchive()).toBe(true)
  })

  it("refuses an unknown edition", () => {
    setEdition("dchp4")
    expect(() => getEditionId()).toThrow(/DCHP_EDITION/)
  })
})

describe("isPathBlockedInArchive", () => {
  it("blocks the editing, Bank and sign-in routes and their children", () => {
    for (const path of [
      "/login",
      "/auth/auth0/callback",
      "/admin",
      "/admin/users",
      "/bank",
      "/bank/own",
      "/insertEntry",
      "/frequency-index/lookups/3",
    ]) {
      expect(isPathBlockedInArchive(path), path).toBe(true)
    }
  })

  it("leaves the reading routes alone", () => {
    for (const path of [
      "/",
      "/about",
      "/entries",
      "/entries/eh",
      "/entries/browse/a",
      "/search",
      "/references",
      "/pages/frontmatter",
      // A headword that happens to start like a blocked prefix is a different
      // segment, not a child of it.
      "/entries/bankable",
      "/banker",
    ]) {
      expect(isPathBlockedInArchive(path), path).toBe(false)
    }
  })
})

describe("throwIfPathBlockedInArchive", () => {
  const request = (path: string) => new Request(`http://localhost:3000${path}`)

  it("does nothing on DCHP-3", () => {
    setEdition("dchp3")
    expect(() => throwIfPathBlockedInArchive(request("/bank"))).not.toThrow()
  })

  it("throws a 404 response for a blocked path in an archive", () => {
    setEdition("dchp1")
    let thrown: unknown
    try {
      throwIfPathBlockedInArchive(request("/bank/own"))
    } catch (e) {
      thrown = e
    }
    expect(thrown).toBeDefined()
    expect((thrown as { init?: { status?: number } }).init?.status).toBe(404)
  })

  it("lets a reading path through in an archive", () => {
    setEdition("dchp1")
    expect(() =>
      throwIfPathBlockedInArchive(request("/entries/eh"))
    ).not.toThrow()
  })
})
