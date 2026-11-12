// Where the app is mounted: "" at the root (DCHP-3, as always), "/dchp1" or
// "/dchp2" for an archive edition behind the proxy. Mirrors `basename` in
// react-router.config.ts and `base` in vite.config.ts, which read the same
// variable. React Router applies it to links, forms, route matching and
// loader redirects itself; the only thing that sees the raw prefix is
// request.url in loaders.
export const BASENAME = (process.env.DCHP_BASENAME || "").replace(/\/$/, "")
