interface Props {
  editable: boolean
  setEditable: React.Dispatch<React.SetStateAction<boolean>>
}

const DisplayEditorToggle = ({ editable, setEditable }: Props) => {
  return (
    <div className="mt-5 h-10 bg-slate-200">
      <label className="">
        Display Editing Fields
        <input
          name="editable"
          checked={editable}
          onChange={(e) => {
            setEditable(e.target.checked)
          }}
          className="mx-5 border bg-slate-100"
          type="checkbox"
        />
      </label>
    </div>
  )
}

export default DisplayEditorToggle
