import clsx from "clsx"
import {
  type ButtonAppearance,
  buttonCommonClasses,
  buttonAppearanceClass,
} from "./ButtonAppearance"
import { type ButtonSize, buttonSizeClass } from "./ButtonSize"
import { linkAppearanceClass } from "./LinkAppearance"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  appearance?: ButtonAppearance
  size?: ButtonSize
  asLink?: boolean
}

const Button = ({
  size = "medium",
  appearance,
  asLink,
  className,
  children,
  ...rest
}: ButtonProps) => (
  <button
    className={clsx(
      !asLink && buttonCommonClasses,
      !asLink
        ? [buttonAppearanceClass(appearance), buttonSizeClass(size)]
        : linkAppearanceClass(appearance),
      className
    )}
    {...rest}
  >
    {children}
  </button>
)

export default Button
