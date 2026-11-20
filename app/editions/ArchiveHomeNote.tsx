type ArchiveHomeNoteProps = {
  // "DCHP-1 Online" / "DCHP-2", as the archive's home page names itself
  siteName: string
  // Year the edition was published
  publishedIn: number
}

// Sits under the title of an archive's home page, so that a visitor who
// lands there from a search engine learns at once that this is not the
// current dictionary and where the current one is. Requested by the
// editorial team. The same amber panel as LegacySiteNote on the How to use
// page, so it reads as new and not as part of the original text.
export default function ArchiveHomeNote({
  siteName,
  publishedIn,
}: ArchiveHomeNoteProps) {
  return (
    <div className="my-6 border border-amber-700 bg-amber-200 p-4">
      <p>
        <strong>Note:</strong> This is an archived version of the dictionary,{" "}
        {siteName} ({publishedIn}). The current edition, DCHP-3, can be accessed
        at{" "}
        <a href="https://dchp.arts.ubc.ca" className="text-primary">
          dchp.arts.ubc.ca
        </a>
        .
      </p>
    </div>
  )
}
