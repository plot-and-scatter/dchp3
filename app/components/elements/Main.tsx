import React from "react"

interface MainProps {
  children: React.ReactNode
}

const Main = ({ children }: MainProps): JSX.Element => {
  return <main className="relative mt-20 w-full p-3 md:mt-36">{children}</main>
}

export default Main
