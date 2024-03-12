import { Popover as HeadlessPopover, Transition } from "@headlessui/react"
import { Fragment } from "react"

interface PopoverProps {
  title: React.ReactNode
  children: React.ReactNode
  show?: boolean
}

export default function Popover({ title, children, show }: PopoverProps) {
  return (
    <HeadlessPopover className="relative">
      {({ open: show }) => (
        <>
          <HeadlessPopover.Button
            className={
              "flex items-center px-1 transition-colors hover:text-primary focus:outline-none md:px-2"
            }
          >
            <span>{title}</span>
            <i className={"fas fa-chevron-down ml-2 h-5 w-5 transition"} />
          </HeadlessPopover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <HeadlessPopover.Panel className="absolute right-0 z-10 mt-3 w-screen max-w-sm px-4 sm:px-0">
              <div className="ring-black overflow-hidden rounded-lg shadow-lg ring-1 ring-opacity-5">
                {children}
              </div>
            </HeadlessPopover.Panel>
          </Transition>
        </>
      )}
    </HeadlessPopover>
  )
}
