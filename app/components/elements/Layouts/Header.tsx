import { Link } from "react-router"
import { EDITIONS } from "~/editions"
import { isArchiveEdition, type EditionId } from "~/editions/edition"

const Header = ({
  isStaging,
  edition,
}: {
  isStaging?: boolean
  edition: EditionId
}): JSX.Element => {
  const config = EDITIONS[edition]
  return (
    <header
      className={`fixed top-0 z-50 flex h-12 w-full items-center justify-center text-white md:h-16 ${
        isStaging ? "bg-amber-800" : "bg-gray-700"
      }`}
    >
      <Link to="/">
        <div className="hidden text-2xl sm:block md:text-3xl">
          {config.headerTitle}
        </div>
        <div className="text-2xl tracking-wider sm:hidden">
          {config.shortName}
        </div>
      </Link>
      {isArchiveEdition(edition) && (
        <span
          className="text-black ml-4 rounded bg-gray-200 px-2 py-0.5 text-sm font-bold tracking-widest"
          title="A read-only archive of this edition"
        >
          ARCHIVE
        </span>
      )}
      {isStaging && (
        <span className="bg-yellow-300 text-black ml-4 rounded px-2 py-0.5 text-sm font-bold tracking-widest">
          STAGING
        </span>
      )}
    </header>
  )
}

export default Header
