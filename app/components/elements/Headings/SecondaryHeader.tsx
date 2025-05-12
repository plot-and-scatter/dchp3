import clsx from "clsx"

interface SecondaryHeaderProps {
  children: React.ReactNode
  noMargin?: boolean
  id?: string
}

export const SecondaryHeader = ({
  children,
  noMargin,
  id,
}: SecondaryHeaderProps) => {
  return (
    <h2
      id={id}
      className={clsx(
        "text-xl font-semibold md:text-2xl",
        !noMargin && "mb-2 md:mb-5"
      )}
    >
      {children}
    </h2>
  )
}
