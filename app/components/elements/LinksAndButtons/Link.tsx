import { buttonAppearanceClass, buttonCommonClasses } from "./ButtonAppearance"
import type { ButtonSize } from "./ButtonSize"
import { buttonSizeClass } from "./ButtonSize"
import { Link as RemixLink } from "@remix-run/react"
import { type LinkAppearance, linkAppearanceClass } from "./LinkAppearance"
import clsx from "clsx"
import type { RemixLinkProps } from "@remix-run/react/dist/components"

interface LinkProps extends RemixLinkProps {
  appearance?: LinkAppearance
  underline?: boolean
  bold?: boolean
  asButton?: boolean
  buttonSize?: ButtonSize
}

export const DchpLink = ({
  appearance,
  underline,
  bold,
  asButton,
  buttonSize,
  className,
  children,
  ...rest
}: LinkProps) => {
  return (
    <RemixLink
      className={clsx(
        underline && `underline`,
        bold && `font-bold`,
        asButton && buttonCommonClasses,
        asButton
          ? [buttonAppearanceClass(appearance), buttonSizeClass(buttonSize)]
          : linkAppearanceClass(appearance),
        className
      )}
      {...rest}
    >
      {children}
    </RemixLink>
  )
}
