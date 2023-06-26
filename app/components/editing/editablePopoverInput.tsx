import { useEffect, useRef, useState } from "react"

interface Props {
  name: string
  label: string
  value: string
  type?: string | undefined
}

const EditableTextArea = (name: string, value: string) => {
  const [initialValue, setInputValue] = useState(value)
  const textAreaElement = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    textAreaElement?.current?.focus()
  }, [])

  return (
    <div className="flex align-middle">
      <textarea
        className="m-2 p-2"
        name={name}
        ref={textAreaElement}
        onChange={(e) => setInputValue(e.target.value)}
        value={initialValue}
      ></textarea>
      <button
        className="mx-3 h-2/3 border border-slate-600 bg-slate-500 p-2 text-white hover:bg-slate-400"
        type="submit"
      >
        submit
      </button>
    </div>
  )
}

const EditableTextInput = (name: string, value: string) => {
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

const EditablePopoverInput = ({ name, label, value, type }: Props) => {
  if (type === "textArea") {
    return (
      <label>
        {label} {EditableTextArea(name, value)}
      </label>
    )
  } else {
    return (
      <label>
        {label} {EditableTextInput(name, value)}
      </label>
    )
  }
}

export default EditablePopoverInput
