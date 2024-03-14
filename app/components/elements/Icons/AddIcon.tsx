import type { FAIconProps } from "./FAIcon"
import FAIcon from "./FAIcon"

type AddIconProps = Omit<FAIconProps, "iconName">

export default function AddIcon(props: AddIconProps) {
  return <FAIcon iconName="fa-plus" {...props} />
}
