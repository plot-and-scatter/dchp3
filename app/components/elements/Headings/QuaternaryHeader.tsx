interface QuaternaryHeaderProps {
  children: React.ReactNode
}

export const QuaternaryHeader = ({ children }: QuaternaryHeaderProps) => {
  return (
    <h3 className="mb-2 text-base font-semibold md:mb-4 md:text-lg">
      {children}
    </h3>
  )
}
