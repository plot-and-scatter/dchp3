import React from "react"

interface CitationProps {
  children: React.ReactNode
  year: string
}

const Citation = ({ children, year }: CitationProps): JSX.Element => {
  return (
    <div>
      <span className="mr-2 font-bold leading-tight text-slate-500">
        {year}
      </span>
      <div className="inline">{children}</div>
      <div className="inline text-sm text-red-400">
        <i className="fa-regular fa-photo-film ml-2 cursor-pointer hover:text-red-600"></i>
        <i className="fa-regular fa-book-open-cover ml-2 cursor-pointer hover:text-red-600"></i>
      </div>
    </div>
  )
}

export default Citation
