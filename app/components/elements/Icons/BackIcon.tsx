import type { FAIconProps } from "./FAIcon"
import FAIcon from "./FAIcon"

type BackIconProps = Omit<FAIconProps, "iconName">

export default function BackIcon(props: BackIconProps) {
  return <FAIcon iconName="fa-arrow-left" {...props} />
}
