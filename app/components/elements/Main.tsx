import React from "react"

interface MainProps {
  children: React.ReactNode
}

const Main = ({ children }: MainProps): JSX.Element => {
  return (
    <main className="relative mt-20 bg-white p-3 md:mx-auto md:mt-36 md:flex md:flex-row md:justify-center">
      {children}
    </main>
  )
}

export default Main
