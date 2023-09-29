export type ButtonSize = "small" | "medium" | "large"

const buttonSizeClasses: Record<ButtonSize, string> = {
  small: "text-sm py-1 px-2",
  medium: "text-base py-2 px-4",
  large: "text-lg py-4 px-8",
}

export const buttonSizeClass = (buttonSize: ButtonSize = "medium") =>
  buttonSizeClasses[buttonSize]
