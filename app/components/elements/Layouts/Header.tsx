import { Link } from "react-router"

const Header = ({ isStaging }: { isStaging?: boolean }): JSX.Element => {
  return (
    <header
      className={`fixed top-0 z-50 flex h-12 w-full items-center justify-center text-white md:h-16 ${
        isStaging ? "bg-amber-800" : "bg-gray-700"
      }`}
    >
      <Link to="/">
        <div className="hidden text-2xl sm:block md:text-3xl">
          Dictionary of Canadianisms on Historical Principles{" "}
          <span className="italic">
            3<sup>rd</sup> Edition
          </span>
        </div>
        <div className="text-2xl tracking-wider sm:hidden">DCHP-3</div>
      </Link>
      {isStaging && (
        <span className="ml-4 rounded bg-yellow-300 px-2 py-0.5 text-sm font-bold tracking-widest text-black">
          STAGING
        </span>
      )}
    </header>
  )
}

export default Header
