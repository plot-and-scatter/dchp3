import Input from "../bank/Input"
import RadioOrCheckbox from "../bank/RadioOrCheckbox"
import FAIcon from "../elements/Icons/FAIcon"

type SearchTermInputProps = {
  data: any
  fields: { searchTerm: any; caseSensitive: any }
  // The submit button, rendered on the same row as the term box.
  action?: React.ReactNode
}

// The search term is what people come for, so it gets a row of its own
// across the form's width, with the button beside it; the case-sensitive
// toggle and Natalia's tips sit directly under it, and the filters follow
// in search.tsx.
export default function SearchTermInput({
  fields,
  data,
  action,
}: SearchTermInputProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full items-stretch gap-3">
        <div className="min-w-0 grow">
          <Input
            type="text"
            placeholder="Search term"
            className="w-full border border-gray-700 p-2 text-2xl"
            name="searchTerm"
            defaultValue={data?.searchParams?.searchTerm}
            conformField={fields.searchTerm}
            autoFocus
          />
        </div>
        {action && <div className="flex shrink-0">{action}</div>}
      </div>
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
      <ul className="flex flex-col gap-1.5 border-l-4 border-amber-500 bg-amber-50 p-3 text-sm">
        <li className="flex gap-2">
          <FAIcon
            iconStyle="far"
            iconName="fa-lightbulb"
            className="w-4 shrink-0 pt-1 text-center"
          />
          <span>
            You can enter <strong>*</strong> to match all entries.
          </span>
        </li>
        <li className="flex gap-2">
          <FAIcon
            iconStyle="far"
            iconName="fa-lightbulb"
            className="w-4 shrink-0 pt-1 text-center"
          />
          <span>
            You can search for headwords using any documented spelling variant
            (e.g. entering <i>abatteau</i> will call up the <i>aboiteau</i>{" "}
            entry).
          </span>
        </li>
        <li className="flex gap-2">
          <FAIcon
            iconStyle="far"
            iconName="fa-lightbulb"
            className="w-4 shrink-0 pt-1 text-center"
          />
          <span>
            You can search for words or phrases in any of the six dictionary
            sections (Headword, Meaning, Canadianism note, Usage note, Fist note
            and Quotation block). Select the relevant tab at the top of the
            search results.
          </span>
        </li>
      </ul>
    </div>
  )
}
