import FAIcon from "../Icons/FAIcon"
import Button from "./Button"
import type { ButtonProps } from "./Button"

type IconButtonProps = ButtonProps & {
  iconName: string
}

export default function IconButton({
  iconName,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <Button {...rest}>
      <FAIcon iconName={iconName} />
      {children}
    </Button>
  )
}
