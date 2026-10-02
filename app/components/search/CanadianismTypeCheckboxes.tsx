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
        options={
          BASE_CANADANISM_TYPES.map((canadianismType) => ({
            label: canadianismType,
            value: canadianismType,
            defaultChecked:
              searchParams?.canadianismType?.includes(canadianismType) ?? true,
          })) as InputOption[]
        }
      />
      {/* A seventh inclusion box: checked, entries confirmed non-Canadian
          are included like any type; unchecked, they are left out. Checked by
          default, and it has no effect on the six type boxes (Stefan,
          2026-09-30). When the page shows a result the box follows what was
          searched; an unchecked box is simply absent from the query string. */}
      <RadioOrCheckbox
        type="checkbox"
        name="nonCanadianism"
        optionSetClassName="flex gap-x-2 mr-4"
        direction="vertical"
        conformField={fields.nonCanadianism}
        options={[
          {
            label: "Non-Canadianisms",
            value: "on",
            defaultChecked: searchParams
              ? searchParams.nonCanadianism === true
              : true,
          },
        ]}
      />
    </div>
  )
}
