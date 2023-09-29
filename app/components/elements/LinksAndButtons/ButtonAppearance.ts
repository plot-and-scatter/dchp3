export type ButtonAppearance =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "action"

export const buttonCommonClasses = `rounded border transition-colors duration-300`

const buttonAppearanceClasses: Record<ButtonAppearance, string> = {
  primary:
    "border-slate-700 border-bottom-slate-800 bg-slate-600 text-white hover:bg-slate-500",
  secondary: "border-stone-500 bg-stone-400 text-white hover:bg-stone-300",
  danger: "border-red-600 bg-red-500 text-white hover:bg-red-400",
  success: "border-emerald-600 bg-emerald-500 text-white hover:bg-emerald-400",
  action: "border-blue-600 bg-blue-500 text-white hover:bg-blue-400",
}

export const buttonAppearanceClass = (
  appearance: ButtonAppearance = "primary"
) => {
  return buttonAppearanceClasses[appearance]
}
