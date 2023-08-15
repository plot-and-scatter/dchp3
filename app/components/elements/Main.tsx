import React from "react"

interface MainProps {
  align?: "left" | "center"
  children: React.ReactNode
}

const Main = ({ children }: MainProps): JSX.Element => {
  const className =
    {
      left: "w-full md:mt-36",
      center: "mx-auto flex w-fit flex-col align-middle",
    }["center"] ?? "w-full"

  return (
    <main className={className + " relative mt-20 p-3 md:mt-36"}>
      {children}
    </main>
  )
}

export default Main
