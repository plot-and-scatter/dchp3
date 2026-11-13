type LegacySiteNoteProps = {
  // "DCHP-1 Online" / "DCHP-2 Online"
  siteName: string
  // Year the legacy site was first released
  releasedIn: number
  // Screenshot of the legacy site's design
  screenshot: string
}

// Sits above the original text of an archive's How to use page: the legacy
// site is gone, and the screenshots in the text below show the old design
// (issue 524). The wording is the editorial team's; set apart in the same
// amber panel as the pre-1967 entry note so it reads as new, not original.
export default function LegacySiteNote({
  siteName,
  releasedIn,
  screenshot,
}: LegacySiteNoteProps) {
  return (
    <div className="my-6 border border-amber-700 bg-amber-200 p-4">
      <p>
        <strong>Note:</strong> The original version of {siteName} was first
        released in {releasedIn}. As of 2026, this legacy version (with design
        shown below) has been discontinued.
      </p>
      <img
        src={screenshot}
        alt={`The ${siteName} site as it looked from ${releasedIn}`}
        className="mx-auto my-4 h-auto max-w-full border border-gray-400 shadow"
      />
      <p>
        The site you are now visiting preserves the original wording and content
        of the {siteName}, which means that the screenshots are now outdated.
        For up-to-date entries, please see the DCHP-3 at{" "}
        <a href="https://dchp.arts.ubc.ca" className="text-primary">
          dchp.arts.ubc.ca
        </a>
        .
      </p>
    </div>
  )
}
