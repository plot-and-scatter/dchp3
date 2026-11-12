// The edition a deployment serves. One codebase serves three dictionaries:
// DCHP-3 (the live, editable edition) and the DCHP-1 and DCHP-2 archives,
// each a read-only front end to its own frozen database. The value comes
// from DCHP_EDITION in the environment; see edition.server.ts.
//
// This file is safe to import from the browser bundle: no env access here.

export const EDITION_IDS = ["dchp1", "dchp2", "dchp3"] as const
export type EditionId = typeof EDITION_IDS[number]

export const DEFAULT_EDITION: EditionId = "dchp3"

export const isEditionId = (value: unknown): value is EditionId =>
  typeof value === "string" &&
  (EDITION_IDS as readonly string[]).includes(value)

// An archive edition is read-only: no sign-in, no Bank, no editing, no
// Frequency Index. Everything a signed-out visitor can see on DCHP-3, and
// nothing else.
export const isArchiveEdition = (edition: EditionId) => edition !== "dchp3"

// Route prefixes that do not exist in an archive. Matched against the start
// of the pathname, so "/bank" also covers "/bank/own". Everything else is
// public reading and stays.
export const ARCHIVE_BLOCKED_PATH_PREFIXES = [
  "/login",
  "/logout",
  "/auth",
  "/admin",
  "/bank",
  "/insertEntry",
  "/users",
  "/profile",
  "/editHistory",
  "/frequency-index",
  "/playground",
  "/not-allowed",
] as const

export const isPathBlockedInArchive = (pathname: string) =>
  ARCHIVE_BLOCKED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
