import RadioOrCheckbox from "../bank/RadioOrCheckbox"
import TopLabelledField from "../bank/TopLabelledField"

type DaggerProps = {
  isNonCanadianism: boolean
  isEditingMode?: boolean
}

export default function NonCanadianism({
  isNonCanadianism,
  isEditingMode,
}: DaggerProps) {
  if (!isEditingMode) {
    return <></>
  }

  return (
    <TopLabelledField
      labelWidth="w-fit"
      label={<div className="text-base">Non-Cdn.?</div>}
      field={
        <div className="flex gap-x-2">
          <RadioOrCheckbox
            type="checkbox"
            name="isNonCanadian"
            optionSetClassName="flex gap-x-2 mr-4"
            inputClassName="my-2 h-6 w-6 border border-gray-300"
            options={[
              {
                label: "",
                value: "true",
                defaultChecked: isNonCanadianism,
              },
            ]}
          />

          {/* <input
            name="isNonCanadian"
            type="checkbox"
            className="h-6 w-6 border border-gray-300"
            defaultChecked={isNonCanadianism}
          /> */}
        </div>
      }
    />
  )
}
