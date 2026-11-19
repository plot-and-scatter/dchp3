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

// A full web address always gets a normal browser page load. Without this,
// React Router treats an address on the site's own hostname as a route of the
// running app, so a link from DCHP-3 to https://dchp.arts.ubc.ca/dchp2 (a
// separate app behind the same hostname) shows DCHP-3's "not found" page.
const isAbsoluteUrl = (to: LinkProps["to"]) =>
  typeof to === "string" && /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(to)

export const Link = ({
  appearance,
  asButton,
  bold,
  buttonSize,
  buttonVariant,
  underline,
  className,
  children,
  to,
  reloadDocument,
  ...rest
}: LinkProps) => {
  return (
    <RemixLink
      to={to}
      reloadDocument={reloadDocument ?? isAbsoluteUrl(to)}
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
