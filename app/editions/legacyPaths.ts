import type { EditionId } from "./edition"
import { isArchiveEdition } from "./edition"

// Addresses from the original DCHP-1 Online (2013) and DCHP-2 (2017)
// websites that the archives serve under a different address. Other sites,
// reference lists and search engines still link to the old forms, so each is
// redirected to the page that replaced it.
//
// Paths here are app paths: no "/dchp1" or "/dchp2" prefix. Matching ignores
// upper and lower case, because the old sites wrote "Entries", "Browse" and
// "Search" with a capital and links in the wild use both. The part that
// names an entry or a letter is passed through unchanged, still encoded.
//
// The list is deliberately the old sites' own page names and nothing wider,
// so that a route added to the app later is not swallowed by a pattern here.
const RULES: { from: RegExp; to: (match: RegExpMatchArray) => string }[] = [
  // An entry: /Entries/view/toque. The old editing address is included
  // because crawlers recorded thousands of them; it goes to the entry.
  { from: /^\/entries\/(?:view|edit)\/(.+)$/i, to: (m) => `/entries/${m[1]}` },

  // Browse by letter: /Browse/view/A. The old DCHP-2 site also had
  // /Browse/view/NonCanadian, which has no counterpart; it goes to the
  // browse page.
  {
    from: /^\/browse\/view\/([^/]+)$/i,
    to: (m) =>
      /^[a-z]$/i.test(m[1])
        ? `/entries/browse/${m[1].toUpperCase()}/1`
        : `/entries`,
  },

  // The old home pages.
  { from: /^\/browse(?:\/welcome(?:\/\d+)?|\/wordoftheday)?$/i, to: () => `/` },
  { from: /^\/pages(?:\/welcome)?$/i, to: () => `/` },
  { from: /^\/index\.html?$/i, to: () => `/` },

  // Search and the reference list.
  { from: /^\/search\/(?:advanced|results)$/i, to: () => `/search` },
  { from: /^\/references\/listing$/i, to: () => `/references` },
]

// Old front-matter pages whose name changed, checked against the pages the
// edition being served has: DCHP-1 has a copyright notice, DCHP-2 does not.
const RENAMED_PAGES: Record<string, string> = {
  copyrightnotice: "copyright-notice",
}

// The new app path for an old address, or undefined when the path is not one
// of the old sites' addresses (which is nearly always).
export const legacyPathRedirect = (
  appPath: string,
  edition: EditionId,
  pageSlugs: readonly string[]
): string | undefined => {
  if (!isArchiveEdition(edition)) return undefined

  // "/Search/advanced/" and "/Search/advanced" are the same old page.
  const path = appPath.length > 1 ? appPath.replace(/\/+$/, "") : appPath

  const page = path.match(/^\/pages\/([^/]+)$/i)
  if (page) {
    const renamed = RENAMED_PAGES[page[1].toLowerCase()]
    if (renamed && pageSlugs.includes(renamed)) return `/pages/${renamed}`
  }

  for (const rule of RULES) {
    const match = path.match(rule.from)
    if (match) return rule.to(match)
  }
  return undefined
}
