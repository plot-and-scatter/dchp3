import clsx from "clsx"

interface SecondaryHeaderProps {
  children: React.ReactNode
  noMargin?: boolean
}

export const SecondaryHeader = ({
  children,
  noMargin,
}: SecondaryHeaderProps) => {
  return (
    <h2
      className={clsx(
        "text-xl font-semibold md:text-2xl",
        !noMargin && "mb-2 md:mb-5"
      )}
    >
      {children}
    </h2>
  )
}
