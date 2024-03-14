type StickyHeaderProps = {
  children: React.ReactNode
}

export default function StickyHeader({ children }: StickyHeaderProps) {
  return (
    <div className="sticky top-32 z-30 -mx-8 rounded-t border-b border-b-gray-400 bg-gray-100/95 py-4 px-8 shadow">
      {children}
    </div>
  )
}
