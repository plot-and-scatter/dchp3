import type { ButtonAppearance } from "./ButtonAppearance"

export type LinkAppearance = ButtonAppearance

const linkAppearanceClasses: Record<LinkAppearance, string> = {
  primary: "text-primary hover:text-primary-light",
  secondary: "text-stone-600 hover:text-stone-400",
  danger: "text-primary-dark hover:text-primary",
  success: "text-emerald-700 hover:text-emerald-500",
  action: "text-blue-700 hover:text-blue-500",
}

export const linkAppearanceClass = (appearance: LinkAppearance = "primary") => {
  return linkAppearanceClasses[appearance]
}
