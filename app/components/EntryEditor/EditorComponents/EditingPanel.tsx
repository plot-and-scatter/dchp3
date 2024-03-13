import StickyHeader from "./StickyHeader"

type EditingPanelProps = {
  header: React.ReactNode
  children: React.ReactNode
}

export default function EditingPanel({ header, children }: EditingPanelProps) {
  return (
    <div className="my-12 rounded border border-gray-400 bg-gray-100 p-8 pt-0 shadow-lg">
      <StickyHeader>{header}</StickyHeader>
      {children}
    </div>
  )
}
