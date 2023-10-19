import { useNavigation } from "@remix-run/react"
import type { ButtonProps } from "./Button"
import Button from "./Button"

type ActionButtonProps = ButtonProps & {
  formActionPath?: string
  submittingElement?: React.ReactNode
}

export default function ActionButton({
  formActionPath,
  children,
  submittingElement,
  ...rest
}: ActionButtonProps) {
  const navigation = useNavigation()

  const isSubmitting =
    (navigation.state === "submitting" || navigation.state === "loading") &&
    (formActionPath ? navigation.formAction === formActionPath : true)

  const content = isSubmitting ? submittingElement || <>Loading...</> : children

  return (
    <Button type="submit" disabled={isSubmitting} {...rest}>
      {content}
    </Button>
  )
}
