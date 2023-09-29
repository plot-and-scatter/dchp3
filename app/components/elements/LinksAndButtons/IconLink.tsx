import { Link } from "./Link"
import type { LinkProps } from "./Link"

type IconLinkProps = LinkProps & {
  iconName: string
}

export default function IconLink({
  iconName,
  children,
  ...rest
}: IconLinkProps) {
  return (
    <Link {...rest}>
      <i className={`fas ${iconName}`} />
      {children}
    </Link>
  )
}
