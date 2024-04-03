import { Fragment, useState } from "react"
import { Combobox as HeadlessCombobox, Transition } from "@headlessui/react"
import FAIcon from "../Icons/FAIcon"
import type { InputOption } from "~/components/bank/InputOption"
import SanitizedTextSpan from "~/components/Entry/Common/SanitizedTextSpan"

type ComboboxProps = React.SelectHTMLAttributes<HTMLInputElement> & {
  conformField?: any
  options: InputOption[]
  name: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  lightBorder?: boolean
  showCount?: boolean
}

export default function Combobox({
  conformField,
  name,
  options,
  onChange,
  className,
  lightBorder,
  defaultValue,
  showCount,
  ...rest
}: ComboboxProps) {
  const [selectedOption, setSelectedOption] = useState<InputOption>()

  return (
    <div>
      <HeadlessCombobox
        value={selectedOption}
        onChange={(e) => setSelectedOption(e)}
        by={(a, b) => a?.value === b?.value}
        name={name}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded text-left">
            <HeadlessCombobox.Input
              className="w-full rounded border border-gray-300 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(option: InputOption) => option?.label}
              onChange={(event) => {
                if (onChange) {
                  onChange(event)
                }
              }}
              {...rest}
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
          >
            <HeadlessCombobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow sm:text-sm">
              {options.length === 0 ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                options.map((option) => (
                  <HeadlessCombobox.Option
                    key={option?.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-primary-dark text-white" : "text-gray-900"
                      }`
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          <SanitizedTextSpan text={option.label} />
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
