// A small status label, in the same idiom as DictionaryVersionLabel and
// DraftLabel: bordered, uppercase, sized to sit inside a table cell.
//
// The tones are about how much attention the state deserves, not about which
// colour looks right in a given table. "warning" means a person should look at
// this row; "neutral" means the state is unremarkable.

import FAIcon from "~/components/elements/Icons/FAIcon"

export type BadgeTone = "neutral" | "success" | "warning" | "danger"

const TONE_CLASS: Record<BadgeTone, string> = {
  neutral: "border-gray-300 bg-gray-100 text-gray-700",
  success: "border-green-300 bg-green-50 text-green-800",
  warning: "border-alert-300 bg-alert-50 text-alert-800",
  danger: "border-red-300 bg-red-50 text-red-800",
}

export default function StatusBadge({
  tone = "neutral",
  children,
  title,
  iconName,
  iconStyle,
}: {
  tone?: BadgeTone
  children: React.ReactNode
  /** Hover text, for a badge whose meaning is not obvious from two words. */
  title?: string
  /** Decorative: the label beside it already says what the badge means. */
  iconName?: string
  iconStyle?: string
}) {
  return (
    <span
      title={title}
      // Uppercase at this size needs room to breathe: padding on all four
      // sides, and letter-spacing, which small capitals want far more than
      // lower case does. px-1 py-0 put the border hard against the letters.
      className={`mr-1 inline-block whitespace-nowrap border px-2 py-1 text-xs uppercase leading-none tracking-wider shadow-sm ${TONE_CLASS[tone]}`}
    >
      {iconName && (
        <FAIcon
          iconName={iconName}
          iconStyle={iconStyle}
          margin="mr-1"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
