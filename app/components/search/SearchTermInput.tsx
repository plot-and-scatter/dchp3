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
      <ul className="flex flex-col gap-1 border-l-4 border-amber-500 bg-amber-50 p-3 text-sm">
        <li>
          <FAIcon iconStyle="far" iconName="fa-lightbulb" className="mr-1" />{" "}
          You can enter <strong>*</strong> to match all entries.
        </li>
        <li>
          <FAIcon iconStyle="far" iconName="fa-lightbulb" className="mr-1" />{" "}
          You can search for headwords using any documented spelling variant
          (e.g. entering <i>abatteau</i> will call up the <i>aboiteau</i>{" "}
          entry).
        </li>
        <li>
          <FAIcon iconStyle="far" iconName="fa-lightbulb" className="mr-1" />{" "}
          You can search for words or phrases in any of the six dictionary
          sections (Headword, Meaning, Canadianism note, Usage note, Fist note
          and Quotation block). Select the relevant tab at the top of the search
          results.
        </li>
      </ul>
      <div className="whitespace-nowrap">
        <RadioOrCheckbox
          type="checkbox"
          name="caseSensitive"
          optionSetClassName="flex items-center gap-x-2 mr-4"
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
