interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large"
  appearance?: "primary" | "secondary" | "danger" | "success" | "linkbutton"
}

const Button: React.FC<ButtonProps> = ({
  size = "medium",
  appearance = "primary",
  className,
  children,
  ...rest
}) => {
  const defaultClassName = `ml-3 border border-slate-600 bg-slate-500 p-2 hover:bg-slate-400 ${
    className || ""
  }`

  const sizeClassName = {
    small: "h-6 w-24 p-1 text-sm",
    medium: "h-8 w-42 p-2 text-base",
    large: "h-10 w-84 p-2 text-lg",
  }[size]

  const appearanceClassName = {
    primary:
      "ml-3 border border-slate-600 bg-slate-500 p-2 text-white hover:bg-slate-400 ",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    linkbutton:
      "w-24 underline hover:bg-blue-200 m-0.5 self-start bg-transparent border-none",
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
