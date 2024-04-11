import { buttonCommonClasses, buttonAppearanceClass } from "./ButtonAppearance"
import { linkAppearanceClass } from "./LinkAppearance"
import { type ButtonSize, buttonSizeClass } from "./ButtonSize"
import clsx from "clsx"
import type { AppearanceVariant, ButtonAppearance } from "./ButtonAppearance"
import { forwardRef } from "react"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  appearance?: ButtonAppearance
  variant?: AppearanceVariant
  size?: ButtonSize
  asLink?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = "medium",
      appearance,
      variant,
      asLink,
      className,
      children,
      disabled,
      ...rest
    }: ButtonProps,
    ref
  ) => (
    <button
      ref={ref}
      className={clsx(
        !asLink && buttonCommonClasses,
        !asLink
          ? [buttonAppearanceClass(appearance, variant), buttonSizeClass(size)]
          : linkAppearanceClass(appearance),
        className,
        disabled && "cursor-not-allowed opacity-50"
      )}
      {...rest}
    >
      {children}
    </button>
  )
)
Button.displayName = "Button"

export default Button
