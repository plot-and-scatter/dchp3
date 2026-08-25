type NewTextProps = {
  children: React.ReactNode
}

export default function NewText({ children }: NewTextProps) {
  return <span className="text-blue-500">{children}</span>
}
