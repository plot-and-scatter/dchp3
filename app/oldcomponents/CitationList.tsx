import React from "react"

interface CitationListProps {
  children: React.ReactNode
}

const CitationList = ({ children }: CitationListProps): JSX.Element => {
  return (
    <div className="-mx-2 -mb-2 mt-2 flex flex-col gap-2 border border-l-0 border-amber-200 bg-amber-50 px-2 py-0 text-base md:-mx-6 md:-mb-4 md:gap-3 md:p-6 md:text-lg">
      <h2 className="text-lg font-bold text-amber-600 md:text-2xl">
        Quotations
      </h2>
      {children}
    </div>
  )
}

export default CitationList
