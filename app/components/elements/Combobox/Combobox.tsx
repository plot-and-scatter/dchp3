import { Fragment, useState } from "react"
import { Combobox as HeadlessCombobox, Transition } from "@headlessui/react"
import FAIcon from "../Icons/FAIcon"
import type { InputOption } from "~/components/bank/InputOption"

type Person = {
  id: number
  name: string
}

const people: InputOption[] = [
  { value: "1", label: "Wade Cooper" },
  { value: "2", label: "Arlene Mccoy" },
  { value: "3", label: "Devon Webb" },
  { value: "4", label: "Tom Cook" },
  { value: "5", label: "Tanya Fox" },
  { value: "6", label: "Hellen Schmidt" },
]

export default function Combobox() {
  const [selected, setSelected] = useState(people[0])
  const [query, setQuery] = useState("")

  console.log("here i am", selected)

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) =>
          person.label
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        )

  return (
    <div className="w-72">
      <HeadlessCombobox
        value={selected}
        onChange={(e) => setSelected(e)}
        by={"value"}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded text-left">
            <HeadlessCombobox.Input
              className="w-full rounded border border-gray-300 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(person: InputOption) => person?.label}
              onChange={(event) => setQuery(event.target.value)}
              name={"headword"}
            />
            <HeadlessCombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <FAIcon
                className="h-4 w-4 text-gray-400"
                iconName="fa-caret-down"
                aria-hidden="true"
              />
            </HeadlessCombobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <HeadlessCombobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow sm:text-sm">
              {filteredPeople.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredPeople.map((person) => (
                  <HeadlessCombobox.Option
                    key={person.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-primary-dark text-white" : "text-gray-900"
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {person.label}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-primary-dark"
                            }`}
                          >
                            <FAIcon iconName="fa-check" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </HeadlessCombobox.Option>
                ))
              )}
            </HeadlessCombobox.Options>
          </Transition>
        </div>
      </HeadlessCombobox>
    </div>
  )
}
