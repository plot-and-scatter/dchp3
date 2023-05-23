import React from "react"

interface HandNoteBlockProps {
  children: React.ReactNode
  className?: string
}

const HandNoteBlock = ({
  children,
  className,
}: HandNoteBlockProps): JSX.Element => {
  return (
    <div
      className={[
        className,
        "flex items-start text-sm leading-snug text-slate-500 md:text-lg",
      ].join(" ")}
    >
      <i className="fa-regular fa-hand-point-right mt-1 w-8 shrink-0"></i>
      <div>{children}</div>
    </div>
  )
}

export default HandNoteBlock
