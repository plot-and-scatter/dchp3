import type { FieldMetadata } from "@conform-to/react"
import RadioOrCheckbox from "../bank/RadioOrCheckbox"

type DatabaseCheckboxesProps = {
  fields: {
    database: FieldMetadata<string[]>
  }
  // The editions in this deployment's database, from the edition config.
  // All checked by default.
  options: { label: string; value: string }[]
}

export default function DatabaseCheckboxes({
  fields,
  options,
}: DatabaseCheckboxesProps) {
  return (
    <div className="flex flex-col">
      <div className="mr-4">
        <strong>Database</strong>
      </div>
      <RadioOrCheckbox
        type="checkbox"
        name="database"
        optionSetClassName="flex items-center gap-x-2 mr-4"
        direction="vertical"
        conformField={fields.database}
        options={options.map((o) => ({ ...o, defaultChecked: true }))}
      />
    </div>
  )
}
