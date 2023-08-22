interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large"
  appearance?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "linkbutton"
    | "action"
}

const Button: React.FC<ButtonProps> = ({
  size = "medium",
  appearance = "primary",
  className,
  children,
  ...rest
}) => {
  const defaultClassName = `border rounded transition-colors transition duration-300 ${
    className || ""
  } `

  const sizeClassName = {
    small: "text-sm py-1 px-2",
    medium: "text-base py-2 px-4",
    large: "text-lg py-4 px-8",
  }[size]

  const appearanceClassName = {
    primary:
      "border-slate-700 border-bottom-slate-800 bg-slate-600 text-white hover:bg-slate-500",
    secondary: "border-stone-500 bg-stone-400 text-white hover:bg-stone-300",
    danger: "border-red-600 bg-red-500 text-white hover:bg-red-400",
    success:
      "border-emerald-600 bg-emerald-500 text-white hover:bg-emerald-400",
    action: "border-blue-600 bg-blue-500 text-white hover:bg-blue-400",
    linkbutton:
      "underline hover:bg-blue-200 m-0.5 self-start bg-transparent border-none",
  }[appearance]

  return (
    <button
      className={`${defaultClassName} ${sizeClassName} ${appearanceClassName}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
