import React from "react"

interface HandNoteProps {
  children: React.ReactNode
  className?: string
}

const HandNote = ({ children, className }: HandNoteProps): JSX.Element => {
  return (
    <div className={[className, "leading-tight text-slate-500"].join(" ")}>
      <i className="fa-solid fa-hand-point-right mr-1"></i>
      {children}
    </div>
  )
}

export default HandNote
