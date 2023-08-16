import React from "react"

interface MainProps {
  center?: boolean
  children: React.ReactNode
}

const Main = ({ center = false, children }: MainProps): JSX.Element => {
  let className = "w-full"
  if (center) {
    className = "mx-auto flex w-fit flex-col align-middle"
  }

  return (
    <main className={className + " relative mt-20 p-3 md:mt-36"}>
      {children}
    </main>
  )
}

export default Main
