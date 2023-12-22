export type ButtonAppearance =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "action"

export type AppearanceVariant = "outline" | "solid"

export const buttonCommonClasses = `rounded border transition-colors duration-300`

const buttonAppearanceClasses: Record<
  `${ButtonAppearance}-${AppearanceVariant}`,
  string
> = {
  "primary-solid": "border-gray-700 bg-gray-600 text-white hover:bg-gray-500",
  "secondary-solid":
    "border-stone-500 bg-stone-400 text-white hover:bg-stone-300",
  "danger-solid":
    "border-primary-dark bg-primary text-white hover:bg-primary-light",
  "success-solid":
    "border-emerald-600 bg-emerald-500 text-white hover:bg-emerald-400",
  "action-solid": "border-blue-600 bg-blue-500 text-white hover:bg-blue-400",

  "primary-outline": "border-gray-700 text-gray-700 hover:bg-gray-50",
  "secondary-outline": "border-stone-500 text-stone-400 hover:bg-stone-50",
  "danger-outline": "border-primary text-primary hover:bg-primary-lightest",
  "success-outline": "border-emerald-600 text-emerald-500 hover:bg-emerald-50",
  "action-outline": "border-blue-600 text-blue-500 hover:bg-blue-50",
}

export const buttonAppearanceClass = (
  appearance: ButtonAppearance = "primary",
  variant: AppearanceVariant = "solid"
) => {
  return buttonAppearanceClasses[`${appearance}-${variant}`]
}
