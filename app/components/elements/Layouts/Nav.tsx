import { Link, NavLink } from "react-router"
import clsx from "clsx"
import type { LoggedInUser } from "~/services/auth/auth.server"
import Popover from "../Popovers/Popover"
import NavPopoverContents from "../Popovers/NavPopoverContents"
import { EDITIONS } from "~/editions"
import { isArchiveEdition, type EditionId } from "~/editions/edition"

interface NavProps {
  user?: LoggedInUser
  edition: EditionId
}

// The front matter links come from the edition (app/editions/index.tsx);
// Browse and Search are the same everywhere; the account menu exists only
// on DCHP-3, since an archive has nobody to sign in.
//
// Below the lg breakpoint the front matter links do not fit in one row
// (DCHP-2 has four, the longest "Acknowledgements"), so they collapse into
// a Menu dropdown and only Browse, Search and the account link stay visible.
// From lg up every link is laid out across the bar as before; between md
// and lg the bars are desktop height but the links would still wrap.
//
// A "dense" edition has more front matter links than fit at that size
// (DCHP-2: six, after Project Team and Project History were added at the
// editors' request; DCHP-1: six, with Copyright Notice). It keeps the Menu
// dropdown up to xl, and from xl shows the links a step smaller and across
// a wider bar, with Browse and Search losing the word "entries". Measured
// at 1280px: DCHP-1's row needs about 1135px at text-lg, against 1152px in
// a max-w-6xl bar and 1256px in max-w-7xl.
const Nav = ({ user, edition }: NavProps): JSX.Element => {
  const config = EDITIONS[edition]
  const archive = isArchiveEdition(edition)
  const dense = config.navLinks.length > 4
  const fullRow = dense ? "hidden xl:inline" : "hidden lg:inline"
  const suffix = dense ? "hidden" : "hidden lg:inline"
  const emphasis =
    "inline-block rounded-md bg-primary px-2 py-1 text-white hover:bg-primary-dark sm:px-3"
  return (
    <nav
      className={clsx(
        "fixed top-12 z-50 flex h-12 w-full items-center justify-center border-b border-gray-500 bg-gray-100 px-3 text-sm text-primary shadow-md sm:text-base md:top-16 md:h-16",
        dense ? "md:text-lg" : "md:text-xl"
      )}
      style={{ backgroundColor: config.tints?.page }}
    >
      <div
        className={clsx(
          // Phones: Menu, Browse and Search at the two edges and the middle.
          // Desktop row: spread evenly, so the gap at either edge matches
          // the gaps between the links.
          "flex w-full items-center justify-between gap-x-2 whitespace-nowrap sm:gap-x-3",
          dense ? "max-w-7xl xl:justify-evenly" : "max-w-6xl lg:justify-evenly"
        )}
      >
        <div className={dense ? "xl:hidden" : "lg:hidden"}>
          <Popover
            align="left"
            title={
              <span>
                <i className="fa-regular fa-bars mr-1"></i> Menu
              </span>
            }
          >
            {(close) => (
              <div className="grid gap-3 bg-white p-4">
                {config.navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => close()}
                    className="flex items-center font-semibold"
                  >
                    <i
                      className={`fa-regular ${link.icon} mr-3 w-5 text-center`}
                    ></i>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </Popover>
        </div>
        {config.navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className={fullRow}>
            <i className={`fa-regular ${link.icon} mr-2`}></i>
            {link.label}
          </NavLink>
        ))}
        {/* Browse and Search are what most visitors came for, so they are
            the two filled buttons in a row of plain links. */}
        <div className="font-bold">
          <NavLink to="/entries" className={emphasis}>
            <i className="fa-regular fa-books mr-1 sm:mr-2"></i> Browse
            <span className={suffix}> entries</span>
          </NavLink>
        </div>
        <div className="font-bold">
          <NavLink to="/search" className={emphasis}>
            <i className="fa-regular fa-search mr-1 sm:mr-2"></i> Search
            <span className={suffix}> entries</span>
          </NavLink>
        </div>
        {!archive && (
          <div>
            {user ? (
              <Popover
                title={
                  <div className="flex items-center">
                    <i className="fas fa-user mr-1 sm:mr-2" />
                    {user.name}
                  </div>
                }
              >
                <NavPopoverContents roles={user.roles} />
              </Popover>
            ) : (
              <NavLink to="/login" title="Admin login" aria-label="Admin login">
                <i className="fa-regular fa-key sm:mr-2"></i>
                <span className="hidden sm:inline">Admin</span>
                <span className="hidden lg:inline"> login</span>
              </NavLink>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Nav
