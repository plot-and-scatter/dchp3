import type { FAIconProps } from "./FAIcon"
import FAIcon from "./FAIcon"

type DeleteIconProps = Omit<FAIconProps, "iconName">

export default function DeleteIcon(props: DeleteIconProps) {
  return <FAIcon iconName="fa-times" {...props} />
}
