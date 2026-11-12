import { NavLink } from "react-router"
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
const Nav = ({ user, edition }: NavProps): JSX.Element => {
  const config = EDITIONS[edition]
  const archive = isArchiveEdition(edition)
  return (
    <nav
      className="fixed top-12 z-50 flex h-8 w-full cursor-pointer items-center  justify-center border-b border-gray-500 bg-gray-100 p-3 text-sm text-primary shadow-md  md:top-16 md:h-16 md:text-xl"
      style={{ backgroundColor: config.pageBackground }}
    >
      <div className="flex w-full max-w-6xl items-center justify-between">
        {config.navLinks.map((link) => (
          <NavLink key={link.to} to={link.to}>
            <i className={`fa-regular ${link.icon} mr-1 sm:mr-2`}></i>
            {link.label}
          </NavLink>
        ))}
        <div className="font-bold">
          <NavLink to="/entries">
            <i className="fa-regular fa-books mr-1 sm:mr-2"></i> Browse
            <span className="hidden md:inline"> entries</span>
          </NavLink>
        </div>
        <div className="font-bold">
          <NavLink to="/search">
            <i className="fa-regular fa-search mr-1 sm:mr-2"></i> Search
            <span className="hidden md:inline"> entries</span>
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
              <NavLink to="/login">
                <i className="fa-regular fa-key mr-1 sm:mr-2"></i> Admin
                <span className="hidden md:inline"> login</span>
              </NavLink>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Nav
