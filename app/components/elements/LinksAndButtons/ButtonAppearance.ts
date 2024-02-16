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
  "secondary-solid": "border-gray-500 bg-gray-400 text-white hover:bg-gray-300",
  "danger-solid":
    "border-primary-dark bg-primary text-white hover:bg-primary-light",
  "success-solid":
    "border-success-600 bg-success-500 text-white hover:bg-success-400",
  "action-solid":
    "border-action-600 bg-action-500 text-white hover:bg-action-400",

  "primary-outline": "border-gray-700 text-gray-700 hover:bg-gray-50",
  "secondary-outline": "border-gray-500 text-gray-400 hover:bg-gray-50",
  "danger-outline": "border-primary text-primary hover:bg-primary-lightest",
  "success-outline": "border-success-600 text-success-500 hover:bg-success-50",
  "action-outline": "border-action-600 text-action-500 hover:bg-action-50",
}

export const buttonAppearanceClass = (
  appearance: ButtonAppearance = "primary",
  variant: AppearanceVariant = "solid"
) => {
  return buttonAppearanceClasses[`${appearance}-${variant}`]
}
