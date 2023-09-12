import type { BankInputProps } from "./BankInput"
import BankInput from "./BankInput"

export default function BankNumericInput(props: BankInputProps) {
  return (
    <BankInput
      type="number"
      className="w-32 border border-slate-700 px-4 py-2"
      {...props}
    />
  )
}
