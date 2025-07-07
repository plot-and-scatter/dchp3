import type { FieldMetadata } from "@conform-to/react"
import RadioOrCheckbox from "../bank/RadioOrCheckbox"

type DatabaseCheckboxesProps = {
  fields: {
    database: FieldMetadata<string[]>
  }
}

export default function DatabaseCheckboxes({
  fields,
}: DatabaseCheckboxesProps) {
  return (
    <div className="flex flex-col">
      <div className="mr-4">
        <strong>Database</strong>
      </div>
      <RadioOrCheckbox
        type="checkbox"
        name="database"
        optionSetClassName="flex gap-x-2 mr-4"
        direction="vertical"
        conformField={fields.database}
        options={[
          { label: "DCHP-1", value: "dchp1" },
          { label: "DCHP-2", value: "dchp2" },
          { label: "DCHP-3", value: "dchp3" },
          { label: "DCHP-3.1", value: "dchp3.1", defaultChecked: true },
        ]}
      />
    </div>
  )
}
