import type { FAIconProps } from "./FAIcon"
import FAIcon from "./FAIcon"

type SaveIconProps = Omit<FAIconProps, "iconName">

export default function SaveIcon(props: SaveIconProps) {
  return <FAIcon iconName="fa-download" {...props} />
}
