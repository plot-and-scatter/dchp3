import React from "react"

interface MainProps {
  center?: boolean
  children: React.ReactNode
}

const Main = ({ center = false, children }: MainProps): JSX.Element => {
  let className = "w-full"
  if (center) {
    className = "mx-auto flex w-full flex-col justify-center items-center"
  }

  return (
    <main className={className + " relative mt-20 p-4 md:mt-32"}>
      {children}
    </main>
  )
}

export default Main
