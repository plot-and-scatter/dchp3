import type { ButtonProps } from "./Button"
import Button from "./Button"

export const scrollWindowToId = (elementId: string): void => {
  const element = document.getElementById(elementId)
  if (element) {
    const headerHeight = document.getElementsByTagName("header")[0].offsetHeight
    const navHeight = document.getElementsByTagName("nav")[0].offsetHeight
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition =
      elementPosition + window.pageYOffset - headerHeight - navHeight
    window.scrollTo({ top: offsetPosition, behavior: "smooth" })
  }
}

type ScrollButtonProps = ButtonProps & {
  scrollToId: string
  children: React.ReactNode
}

export default function ScrollButton({
  children,
  scrollToId,
  ...rest
}: ScrollButtonProps) {
  return (
    <Button {...rest} asLink onClick={() => scrollWindowToId(scrollToId)}>
      {children}
    </Button>
  )
}
