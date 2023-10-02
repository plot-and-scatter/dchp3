import { buttonCommonClasses, buttonAppearanceClass } from "./ButtonAppearance"
import { linkAppearanceClass } from "./LinkAppearance"
import { type ButtonSize, buttonSizeClass } from "./ButtonSize"
import clsx from "clsx"
import type { AppearanceVariant, ButtonAppearance } from "./ButtonAppearance"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  appearance?: ButtonAppearance
  variant?: AppearanceVariant
  size?: ButtonSize
  asLink?: boolean
}

const Button = ({
  size = "medium",
  appearance,
  variant,
  asLink,
  className,
  children,
  ...rest
}: ButtonProps) => (
  <button
    className={clsx(
      !asLink && buttonCommonClasses,
      !asLink
        ? [buttonAppearanceClass(appearance, variant), buttonSizeClass(size)]
        : linkAppearanceClass(appearance),
      className
    )}
    {...rest}
  >
    {children}
  </button>
)

export default Button
