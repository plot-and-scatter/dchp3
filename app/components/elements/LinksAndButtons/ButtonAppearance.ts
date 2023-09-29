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
  "primary-solid":
    "border-slate-700 bg-slate-600 text-white hover:bg-slate-500",
  "secondary-solid":
    "border-stone-500 bg-stone-400 text-white hover:bg-stone-300",
  "danger-solid": "border-red-600 bg-red-500 text-white hover:bg-red-400",
  "success-solid":
    "border-emerald-600 bg-emerald-500 text-white hover:bg-emerald-400",
  "action-solid": "border-blue-600 bg-blue-500 text-white hover:bg-blue-400",

  "primary-outline": "border-slate-700 text-slate-700 hover:bg-slate-50",
  "secondary-outline": "border-stone-500 text-stone-400 hover:bg-stone-50",
  "danger-outline": "border-red-600 text-red-500 hover:bg-red-50",
  "success-outline": "border-emerald-600 text-emerald-500 hover:bg-emerald-50",
  "action-outline": "border-blue-600 text-blue-500 hover:bg-blue-50",
}

export const buttonAppearanceClass = (
  appearance: ButtonAppearance = "primary",
  variant: AppearanceVariant = "solid"
) => {
  return buttonAppearanceClasses[`${appearance}-${variant}`]
}
