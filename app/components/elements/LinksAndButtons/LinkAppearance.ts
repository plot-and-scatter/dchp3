import type { ButtonAppearance } from "./ButtonAppearance"

export type LinkAppearance = ButtonAppearance

const linkAppearanceClasses: Record<LinkAppearance, string> = {
  primary: "text-primary hover:text-primary-light",
  secondary: "text-gray-600 hover:text-gray-400",
  danger: "text-primary-dark hover:text-primary",
  success: "text-success-700 hover:text-success-500",
  action: "text-action-700 hover:text-action-500",
}

export const linkAppearanceClass = (appearance: LinkAppearance = "primary") => {
  return linkAppearanceClasses[appearance]
}
