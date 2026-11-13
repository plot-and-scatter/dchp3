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
      {/* Two columns on phones, read down then across; one from sm up. */}
      <div className="columns-2 gap-x-4 sm:columns-1">
        <RadioOrCheckbox
          type="checkbox"
          name="database"
          optionSetClassName="flex items-baseline gap-x-2"
          direction="vertical"
          conformField={fields.database}
          options={options.map((o) => ({ ...o, defaultChecked: true }))}
        />
      </div>
    </div>
  )
}
