import { Popover as HeadlessPopover, Transition } from "@headlessui/react"
import { Fragment } from "react"

interface PopoverProps {
  title: React.ReactNode
  // Plain contents, or a function that receives `close` so a link inside the
  // panel can shut it on click (the panel otherwise stays open across a
  // client-side navigation, because the nav never unmounts).
  children: React.ReactNode | ((close: () => void) => React.ReactNode)
  // Which edge of the button the panel hangs from. Defaults to the right,
  // which suits the account menu at the right end of the nav.
  align?: "left" | "right"
  show?: boolean
}

export default function Popover({
  title,
  children,
  align = "right",
}: PopoverProps) {
  return (
    <HeadlessPopover className="relative">
      {({ open: show }) => (
        <Fragment>
          <HeadlessPopover.Button
            className={
              "flex items-center px-1 transition-colors hover:text-primary focus:outline-none md:px-2"
            }
          >
            <span>{title}</span>
            <i className="fas fa-chevron-down ml-1.5 text-[0.7em] transition" />
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
            <HeadlessPopover.Panel
              className={`absolute z-10 mt-3 w-screen max-w-sm px-4 sm:px-0 ${
                align === "left" ? "left-0" : "right-0"
              }`}
            >
              {({ close }) => (
                <div className="ring-black overflow-hidden rounded-lg shadow-lg ring-1 ring-opacity-5">
                  {typeof children === "function" ? children(close) : children}
                </div>
              )}
            </HeadlessPopover.Panel>
          </Transition>
        </Fragment>
      )}
    </HeadlessPopover>
  )
}
