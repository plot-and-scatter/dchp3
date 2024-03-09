interface TertiaryHeaderProps {
  children: React.ReactNode
}

export const TertiaryHeader = ({ children }: TertiaryHeaderProps) => {
  return (
    <h3 className="mb-2 text-lg font-semibold md:mb-4 md:text-xl">
      {children}
    </h3>
  )
}
