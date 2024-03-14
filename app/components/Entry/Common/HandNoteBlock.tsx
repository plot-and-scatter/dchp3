import clsx from "clsx"

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
      className={clsx(
        className,
        "HandNoteBlock", // See the file `additional.css` for blockquote styling.
        "flex items-start text-sm leading-snug text-gray-500 md:text-lg"
      )}
    >
      <i className="fa-regular fa-hand-point-right mt-1 w-8 shrink-0"></i>
      {children}
    </div>
  )
}

export default HandNoteBlock
