// This MUST be on the server only! Do not remove .server. from the filename!

export const getBaseDeploymentUrl = () => {
  // TODO: Better type above

  // TODO: Better validation below
  const siteUrl = process.env.SITE_URL
  const isSiteUrlValid = siteUrl !== undefined && siteUrl.length > 0

  if (!isSiteUrlValid) {
    throw new Error(`Site URL is invalid!`)
  }

  // Preferentially return the SITE_URL over the CF_PAGES_URL
  return siteUrl
}
