import { BASE_CANADANISM_TYPES } from "~/types/CanadianismTypeEnum"
import RadioOrCheckbox from "../bank/RadioOrCheckbox"
import type { FieldMetadata } from "@conform-to/react"
import type { InputOption } from "../bank/InputOption"

type CanadianismTypeCheckboxesProps = {
  fields: {
    canadianismType: FieldMetadata<string[]>
    nonCanadianism: FieldMetadata<boolean | null | undefined>
  }
  searchParams?: {
    canadianismType?: string[]
    nonCanadianism?: boolean | null | undefined
  }
}

export default function CanadianismTypeCheckboxes({
  fields,
  searchParams,
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
        disabled={fields.nonCanadianism.value === "on"}
        options={
          BASE_CANADANISM_TYPES.map((canadianismType) => ({
            label: canadianismType,
            value: canadianismType,
            defaultChecked:
              searchParams?.canadianismType?.includes(canadianismType) ?? true,
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
            defaultChecked: searchParams?.nonCanadianism ?? false,
          },
        ]}
      />
    </div>
  )
}
