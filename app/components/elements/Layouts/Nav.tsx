import { Link, NavLink } from "react-router"
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
const Nav = ({ user, edition }: NavProps): JSX.Element => {
  const config = EDITIONS[edition]
  const archive = isArchiveEdition(edition)
  return (
    <nav
      className="fixed top-12 z-50 flex h-12 w-full items-center justify-center border-b border-gray-500 bg-gray-100 px-3 text-sm text-primary shadow-md sm:text-base md:top-16 md:h-16 md:text-xl"
      style={{ backgroundColor: config.tints?.page }}
    >
      <div className="flex w-full max-w-6xl items-center justify-between gap-x-2 whitespace-nowrap sm:gap-x-3 lg:whitespace-normal">
        <div className="lg:hidden">
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
          <NavLink key={link.to} to={link.to} className="hidden lg:inline">
            <i className={`fa-regular ${link.icon} mr-2`}></i>
            {link.label}
          </NavLink>
        ))}
        <div className="font-bold">
          <NavLink to="/entries">
            <i className="fa-regular fa-books mr-1 sm:mr-2"></i> Browse
            <span className="hidden lg:inline"> entries</span>
          </NavLink>
        </div>
        <div className="font-bold">
          <NavLink to="/search">
            <i className="fa-regular fa-search mr-1 sm:mr-2"></i> Search
            <span className="hidden lg:inline"> entries</span>
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
