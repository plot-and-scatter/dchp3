import Input from "../bank/Input"
import RadioOrCheckbox from "../bank/RadioOrCheckbox"
import FAIcon from "../elements/Icons/FAIcon"

type SearchTermInputProps = {
  data: any
  fields: { searchTerm: any; caseSensitive: any }
}

export default function SearchTermInput({
  fields,
  data,
}: SearchTermInputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Input
        type="text"
        placeholder="Search term"
        className="border border-gray-700 p-2 text-2xl"
        name="searchTerm"
        defaultValue={data?.searchParams?.searchTerm}
        conformField={fields.searchTerm}
        autoFocus
      />
      <p className="text-sm">
        <FAIcon iconStyle="far" iconName="fa-lightbulb" className="mr-1" /> You
        can enter <strong>*</strong> to match all entries.
      </p>
      <div className="whitespace-nowrap">
        <RadioOrCheckbox
          type="checkbox"
          name="caseSensitive"
          optionSetClassName="flex gap-x-2 mr-4"
          conformField={fields.caseSensitive}
          options={[
            {
              label: "Case sensitive search",
              value: "on",
              defaultChecked: false,
            },
          ]}
        />
      </div>
    </div>
  )
}
