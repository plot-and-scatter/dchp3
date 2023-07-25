import { parseBooleanOrError } from "~/utils/generalUtils"

interface Props {
  editable: boolean
  setEditable: React.Dispatch<React.SetStateAction<boolean>>
}

const DisplayEditorToggle = ({ editable, setEditable }: Props) => {
  const changeEditable = (value: string) => {
    const booleanValue = parseBooleanOrError(value)
    const nextValue = !booleanValue
    setEditable(nextValue)
  }

  return (
    <div className="mt-5 h-10 bg-slate-200">
      <label className="m-5">
        Display Editing Fields
        <input
          name="editable"
          value={editable.toString()}
          onChange={(e) => {
            changeEditable(e.target.value)
          }}
          className="mx-5 border bg-slate-100"
          type="checkbox"
        />
      </label>
    </div>
  )
}

export default DisplayEditorToggle
