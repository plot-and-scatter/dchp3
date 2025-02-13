import { BASE_CANADANISM_TYPES } from "~/types/CanadianismTypeEnum"
import RadioOrCheckbox from "../bank/RadioOrCheckbox"
import type { InputOption } from "../bank/InputOption"

type CanadianismTypeCheckboxesProps = {
  fields: { canadianismType: any; nonCanadianism: any }
  data: any
}

export default function CanadianismTypeCheckboxes({
  fields,
  data,
}: CanadianismTypeCheckboxesProps) {
  return (
    <div className="flex flex-col">
      <div className="mr-4">
        <strong>Canadianism type</strong>
      </div>
      <RadioOrCheckbox
        type="checkbox"
        name="canadianismType"
        optionSetClassName="flex gap-x-2 mr-4"
        direction="vertical"
        conformField={fields.canadianismType}
        disabled={fields.nonCanadianism?.value === "on"}
        options={
          BASE_CANADANISM_TYPES.map((canadianismType) => ({
            label: canadianismType,
            value: canadianismType,
            defaultChecked:
              data?.searchParams.canadianismType?.includes(canadianismType) ??
              true,
          })) as InputOption[]
        }
      />
      <RadioOrCheckbox
        type="checkbox"
        name="nonCanadianism"
        optionSetClassName="flex gap-x-2 mr-4"
        direction="vertical"
        conformField={fields.nonCanadianism}
        options={[
          {
            label: "Non-Canadian only",
            value: "on",
            defaultChecked: data?.searchParams.nonCanadianism ?? false,
          },
        ]}
      />
    </div>
  )
}
