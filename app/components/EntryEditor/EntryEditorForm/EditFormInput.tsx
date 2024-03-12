interface editHeadwordInputProps {
  label: string
  value: string
  name: string
  type?: "input" | "textarea" | "dropdown"
  onChangeFunction: React.SetStateAction<any>
  className?: string
}

export function EditFormInput(props: editHeadwordInputProps) {
  let inputElm = getEditFormInput(props)
  let { className, name, label } = props

  return (
    <div className={className}>
      <label htmlFor={name} className="m-2">
        {label}
      </label>
      {inputElm}
    </div>
  )
}

function getEditFormInput({
  value,
  name,
  type,
  onChangeFunction,
}: editHeadwordInputProps) {
  switch (type) {
    case "textarea":
      return (
        <textarea
          value={value}
          name={name}
          onChange={(e) => onChangeFunction(e.target.value)}
          className="m-1 h-24 w-full border p-1"
        />
      )
    default:
      return (
        <input
          value={value}
          name={name}
          type={type}
          onChange={(e) => onChangeFunction(e.target.value)}
          className="m-1 w-1/2 border p-1"
        />
      )
  }
}
