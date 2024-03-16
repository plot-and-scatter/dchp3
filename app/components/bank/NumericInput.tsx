import type { InputProps } from "./Input"
import Input from "./Input"

export default function NumericInput(props: InputProps) {
  console.log("props", props.onChange)

  return (
    <Input
      type="number"
      className="w-32 border border-gray-700 px-4 py-2"
      {...props}
    />
  )
}
