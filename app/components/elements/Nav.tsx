import React from "react"
import { Link } from "react-router-dom"

const Nav = (): JSX.Element => {
  return (
    <nav className="fixed top-12 z-50 flex h-8 w-full cursor-pointer items-center  justify-center border-b border-slate-500 bg-slate-100 p-3 text-sm text-red-600 shadow-md md:top-16 md:h-16 md:text-xl">
      {/* <div className="flex items-center gap-4 text-base">
    <div className="">Introduction</div>
    <div className="">Acknowledgements</div>
    <div className="">Foreword</div>
    <div className="">Project History &amp; Team</div>
  </div> */}
      <div className="flex w-full max-w-6xl items-center justify-between">
        <Link to="/about">
          <i className="fa-regular fa-circle-info mr-1 sm:mr-2"></i> About
          <span className="hidden md:inline"> the DCHP-3</span>
        </Link>
        <Link to="/insertEntry">
          <i className="fa-regular fa-circle-info mr-1 sm:mr-2"></i> Insert
          <span className="hidden md:inline"> entries </span>
        </Link>
        <div className="font-bold">
          <Link to="/entries">
            <i className="fa-regular fa-books mr-1 sm:mr-2"></i> Browse
            <span className="hidden md:inline"> entries</span>
          </Link>
        </div>
        <div className="font-bold">
          <Link to="/search">
            <i className="fa-regular fa-search mr-1 sm:mr-2"></i> Search
            <span className="hidden md:inline"> entries</span>
          </Link>
        </div>
        <div className="text-sm">
          <Link to="/login">
            <i className="fa-regular fa-key mr-1 sm:mr-2"></i> Admin
            <span className="hidden md:inline"> login</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Nav
