import type { FAIconProps } from "./FAIcon"
import FAIcon from "./FAIcon"

type EditIconProps = Omit<FAIconProps, "iconName">

export default function EditIcon(props: EditIconProps) {
  return <FAIcon iconName="fa-edit" {...props} />
}
