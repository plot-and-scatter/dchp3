const Header = (): JSX.Element => {
  return (
    <header className="fixed top-0 z-50 flex h-12 w-full items-center justify-center bg-gray-700 text-white md:h-16">
      <div className="hidden text-2xl sm:block md:text-3xl">
        Dictionary of Canadianisms on Historical Principles{" "}
        <span className="italic">
          3<sup>rd</sup> Edition
        </span>
      </div>
      <div className="text-2xl tracking-wider sm:hidden">DCHP-3</div>
    </header>
  )
}

export default Header
