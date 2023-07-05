import { useEffect, useRef, useState } from "react"

interface Props {
  name: string
  value: string
}

const EditableTextInput = ({ name, value }: Props) => {
  const [initialValue, setInputValue] = useState(value)
  const inputElement = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputElement?.current?.focus()
  }, [])

  return (
    <input
      ref={inputElement}
      className="m-2 p-2"
      name={name}
      onChange={(e) => setInputValue(e.target.value)}
      value={initialValue}
    />
  )
}

export default EditableTextInput
