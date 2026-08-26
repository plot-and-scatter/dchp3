import { buttonAppearanceClass, buttonCommonClasses } from "./ButtonAppearance"
import { buttonSizeClass } from "./ButtonSize"
import { Link as RemixLink } from "react-router"
import { type LinkAppearance, linkAppearanceClass } from "./LinkAppearance"
import clsx from "clsx"
import type { AppearanceVariant } from "./ButtonAppearance"
import type { ButtonSize } from "./ButtonSize"
import type { LinkProps as ReactRouterLinkProps } from "react-router"

export type LinkProps = ReactRouterLinkProps & {
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
              "inline-block",
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
