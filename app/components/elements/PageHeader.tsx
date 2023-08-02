interface PageHeaderProps {
  children: React.ReactNode
}

export const PageHeader = ({ children }: PageHeaderProps) => {
  return <h1 className="mb-4 text-2xl font-semibold">{children}</h1>
}
