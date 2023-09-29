import type { ButtonAppearance } from "./ButtonAppearance"

export type LinkAppearance = ButtonAppearance

const linkAppearanceClasses: Record<LinkAppearance, string> = {
  primary: "text-red-600 hover:text-red-400",
  secondary: "text-stone-600 hover:text-stone-400",
  danger: "text-red-800 hover:text-red-600",
  success: "text-emerald-700 hover:text-emerald-500",
  action: "text-blue-700 hover:text-blue-500",
}

export const linkAppearanceClass = (appearance: LinkAppearance = "primary") => {
  return linkAppearanceClasses[appearance]
}
