import React from "react"

interface BibliographyItemProps {
  label: string
  value: React.ReactNode
}

const BibliographyItem = ({
  label,
  value,
}: BibliographyItemProps): JSX.Element => {
  if (!value) return <></>
  return (
    <div className="BibliographyItem flex">
      <dt className="w-20 shrink-0 font-bold">{label}</dt>
      <dt className="break-all">{value}</dt>
    </div>
  )
}

export default BibliographyItem
