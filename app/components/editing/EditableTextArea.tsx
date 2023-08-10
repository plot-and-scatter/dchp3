import { useEffect, useRef, useState } from "react"

interface Props {
  name: string
  value: string
}

const EditableTextArea = ({ name, value }: Props) => {
  const [initialValue, setInputValue] = useState(value)
  const textAreaElement = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    textAreaElement?.current?.focus()
  }, [])

  return (
    <div className="flex align-middle">
      <label>
        Input:
        <textarea
          className="m-2 p-2"
          name={name}
          ref={textAreaElement}
          onChange={(e) => setInputValue(e.target.value)}
          value={initialValue}
        ></textarea>
      </label>
      <button
        className="mx-3 h-2/3 border border-slate-600 bg-slate-500 p-2 text-white hover:bg-slate-400"
        type="submit"
      >
        submit
      </button>
    </div>
  )
}

export default EditableTextArea
