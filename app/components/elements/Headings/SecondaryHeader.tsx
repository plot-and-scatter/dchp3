interface SecondaryHeaderProps {
  children: React.ReactNode
}

export const SecondaryHeader = ({ children }: SecondaryHeaderProps) => {
  return (
    <h2 className="mb-2 text-xl font-semibold md:mb-5 md:text-2xl">
      {children}
    </h2>
  )
}
