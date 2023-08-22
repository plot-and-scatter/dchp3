interface PageHeaderProps {
  children: React.ReactNode
}

export const PageHeader = ({ children }: PageHeaderProps) => {
  return (
    <h1 className="mb-2 text-3xl font-semibold md:mb-5 md:text-5xl">
      {children}
    </h1>
  )
}
