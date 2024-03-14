import clsx from "clsx"

export type FAIconProps = React.HTMLAttributes<HTMLElement> & {
  iconStyle?: string
  iconName: string
  margin?: string
}

export default function FAIcon({
  className,
  iconStyle = "fas",
  iconName,
  margin,
  ...rest
}: FAIconProps) {
  return (
    <i
      className={clsx(iconStyle, iconName, margin || "mr-1", className)}
      {...rest}
    />
  )
}
