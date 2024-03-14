import RadioOrCheckbox from "../../bank/RadioOrCheckbox"
import TopLabelledField from "../../bank/TopLabelledField"

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
        <div className="flex gap-x-2 text-3xl leading-tight md:text-5xl">
          <RadioOrCheckbox
            type="checkbox"
            name="dagger"
            optionSetClassName="flex gap-x-2"
            inputClassName="my-2 h-6 w-6 border border-gray-300"
            options={[
              {
                label: "",
                value: "true",
                defaultChecked: dagger,
              },
            ]}
          />
          <div>&dagger;</div>
        </div>
      }
    />
  )
}
