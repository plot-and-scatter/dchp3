import { buttonAppearanceClass, buttonCommonClasses } from "./ButtonAppearance"
import { buttonSizeClass } from "./ButtonSize"
import { Link as RemixLink } from "@remix-run/react"
import { type LinkAppearance, linkAppearanceClass } from "./LinkAppearance"
import clsx from "clsx"
import type { AppearanceVariant } from "./ButtonAppearance"
import type { ButtonSize } from "./ButtonSize"
import type { RemixLinkProps } from "@remix-run/react/dist/components"

export type LinkProps = RemixLinkProps & {
  appearance?: LinkAppearance
  asButton?: boolean
  bold?: boolean
  buttonSize?: ButtonSize
  buttonVariant?: AppearanceVariant
  underline?: boolean
}

export const Link = ({
  appearance,
  asButton,
  bold,
  buttonSize,
  buttonVariant,
  underline,
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
          ? [
              buttonAppearanceClass(appearance, buttonVariant),
              buttonSizeClass(buttonSize),
            ]
          : linkAppearanceClass(appearance),
        className
      )}
      {...rest}
    >
      {children}
    </RemixLink>
  )
}
