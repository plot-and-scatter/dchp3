import clsx from "clsx"

type FAIconProps = React.HTMLAttributes<HTMLElement> & {
  iconStyle?: string
  iconName: string
}

export default function FAIcon({
  className,
  iconStyle = "fas",
  iconName,
  ...rest
}: FAIconProps) {
  return <i className={clsx(iconStyle, iconName, className)} {...rest} />
}
