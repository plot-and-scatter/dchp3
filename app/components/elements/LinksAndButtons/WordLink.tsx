import { Link, type LinkProps } from "./Link"

type WordLinkProps = Omit<LinkProps, "to"> & {
  to?: string
}

export default function WordLink(props: WordLinkProps) {
  const { to, ...rest } = props

  // If no `to` prop is specified, we will by default just link to the children
  // prop, interpreting it as a string.
  const linkTo =
    to ??
    (typeof props.children === "string" ? "/entries/" + props.children : "")

  return (
    <Link {...rest} to={linkTo}>
      <em>{props.children}</em>
    </Link>
  )
}
