import clsx from "clsx"

type ValidationErrorTextProps = {
  children: React.ReactNode
  className?: string
}

export default function ValidationErrorText({
  children,
  className,
}: ValidationErrorTextProps) {
  return (
    <div className={clsx("text-sm text-primary-dark", className)}>
      {children}
    </div>
  )
}
