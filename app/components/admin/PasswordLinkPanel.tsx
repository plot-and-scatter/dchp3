import { Fragment, useState } from "react"
import Button from "~/components/elements/LinksAndButtons/Button"

// The link is a credential for as long as it lives: anyone holding it can set
// that account's password. So it is shown once, never stored, and never
// logged. If it is lost, issue another from their own page rather than
// trying to recover this one.

export default function PasswordLinkPanel({
  ticketUrl,
  warnings,
  created,
}: {
  ticketUrl: string | null
  warnings: string[]
  created?: string
}) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="my-4 border-l-4 border-green-500 bg-green-50 p-4">
      <p className="font-semibold">
        {created ? `${created} was created.` : "New password link."}
      </p>

      {ticketUrl ? (
        <Fragment>
          <p className="mt-1">
            Send them this link. It lets them choose their own password, works
            once, and expires in a week. It is not shown again — if it is lost,
            make another from their page.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <input
              readOnly
              value={ticketUrl}
              className="w-full border border-gray-400 bg-white p-2 text-sm"
              onFocus={(event) => event.currentTarget.select()}
            />
            <Button
              type="button"
              appearance="action"
              onClick={() => {
                navigator.clipboard?.writeText(ticketUrl)
                setCopied(true)
              }}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </Fragment>
      ) : (
        <p className="mt-1">
          No password link was made. Make one from their page.
        </p>
      )}

      {warnings.length > 0 && (
        <ul className="mt-3 list-disc pl-5">
          {warnings.map((warning) => (
            <li key={warning} className="text-alert-800">
              {warning}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
