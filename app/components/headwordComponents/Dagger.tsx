import TopLabelledField from "../bank/TopLabelledField"

type DaggerProps = {
  dagger: boolean
  isEditingMode?: boolean
}

export default function Dagger({ dagger, isEditingMode }: DaggerProps) {
  if (!isEditingMode) {
    return dagger ? <span className="align-super">&dagger;</span> : <></>
  }

  return (
    <TopLabelledField
      labelWidth="w-fit"
      label={<div className="text-base">Dagger?</div>}
      field={
        <div className="flex gap-x-2">
          <input
            name="dagger"
            type="checkbox"
            className="h-6 w-6 border border-gray-300"
            defaultChecked={dagger}
          />
          <div>&dagger;</div>
        </div>
      }
    />
  )
}
