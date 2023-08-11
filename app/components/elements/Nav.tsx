import { NavLink } from "@remix-run/react"
import type { LoggedInUser } from "~/services/auth/auth.server"

interface NavProps {
  user?: LoggedInUser
}

const Nav = ({ user }: NavProps): JSX.Element => {
  return (
    <nav className="fixed top-12 z-50 flex h-8 w-full cursor-pointer items-center  justify-center border-b border-slate-500 bg-slate-100 p-3 text-sm text-red-600 shadow-md md:top-16 md:h-16 md:text-xl">
      {/* <div className="flex items-center gap-4 text-base">
    <div className="">Introduction</div>
    <div className="">Acknowledgements</div>
    <div className="">Foreword</div>
    <div className="">Project History &amp; Team</div>
  </div> */}
      <div className="flex w-full max-w-6xl items-center justify-between">
        <NavLink to="/about">
          <i className="fa-regular fa-circle-info mr-1 sm:mr-2"></i> About
          <span className="hidden md:inline"> the DCHP-3</span>
        </NavLink>
        <NavLink to="/reference">
          <i className="fa-regular fa-book mr-1 sm:mr-2"></i>
          <span className="hidden md:inline">References</span>
        </NavLink>
        <NavLink to="/bank">
          <i className="fa-solid fa-leaf-maple mr-1 sm:mr-2"></i>
          BCE
        </NavLink>
        <NavLink to="/insertEntry">
          <i className="fa-regular fa-circle-info mr-1 sm:mr-2"></i> Insert
          <span className="hidden md:inline"> entry </span>
        </NavLink>
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
        <div className="text-sm">
          {user ? (
            <NavLink to="/admin">
              <i className="fa-regular fa-key mr-1 sm:mr-2"></i> Admin screen
            </NavLink>
          ) : (
            <NavLink to="/login">
              <i className="fa-regular fa-key mr-1 sm:mr-2"></i> Admin
              <span className="hidden md:inline"> login</span>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Nav
