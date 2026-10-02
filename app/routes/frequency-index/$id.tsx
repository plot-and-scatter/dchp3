import { Fragment, useEffect } from "react"
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  Form,
  data,
  redirect,
  useLoaderData,
  useNavigation,
} from "react-router"
import Main from "~/components/elements/Layouts/Main"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import BackLink from "~/components/frequencyIndex/BackLink"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import Button from "~/components/elements/LinksAndButtons/Button"
import FAIcon from "~/components/elements/Icons/FAIcon"
import DeleteIcon from "~/components/elements/Icons/DeleteIcon"
import LookupRowsTable from "~/components/frequencyIndex/LookupRowsTable"
import { formatCount } from "~/models/frequencyIndex"
import {
  deleteFrequencyLookup,
  getFrequencyLookup,
  getNormalizerHistory,
} from "~/models/frequencyIndex.server"
import { clearDraft } from "~/models/frequencyIndexDraft"
import { userName } from "~/components/frequencyIndex/userName"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import { FREQUENCY_INDEX_PERMISSION, SPARKLINE_DAYS } from "./index"

const lookupId = (params: { id?: string }) => {
  const id = Number(params.id)
  return Number.isInteger(id) ? id : null
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await redirectIfUserLacksPermission(request, FREQUENCY_INDEX_PERMISSION)

  const id = lookupId(params)
  const lookup = id === null ? null : await getFrequencyLookup(id)
  if (!lookup) throw data({ message: "Lookup not found" }, { status: 404 })

  const since = new Date(Date.now() - SPARKLINE_DAYS * 24 * 3600 * 1000)
  const normalizerHistory = await getNormalizerHistory(lookup.normalizer, since)
  return { lookup, normalizerHistory }
}

// The only action here is delete. Observations read during this lookup are
// deleted with it unless another lookup reused them.
export const action = async ({ request, params }: ActionFunctionArgs) => {
  await redirectIfUserLacksPermission(request, FREQUENCY_INDEX_PERMISSION)

  const id = lookupId(params)
  const formData = await request.formData()
  if (id === null || formData.get("intent") !== "delete")
    throw data({ message: "Unknown action" }, { status: 400 })

  const deleted = await deleteFrequencyLookup(id)
  if (!deleted) throw data({ message: "Lookup not found" }, { status: 404 })
  return redirect("/frequency-index")
}

export default function FrequencyLookupPage() {
  const { lookup, normalizerHistory } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const deleting = navigation.state !== "idle"

  // Arriving here means a lookup was saved, so the local draft is stale.
  useEffect(() => {
    clearDraft()
  }, [lookup.id])

  const repeatParams = new URLSearchParams({
    term: lookup.term,
    normalizer: lookup.normalizer,
    exclusions: lookup.exclusions ?? "",
    multiplier: String(lookup.multiplier),
  })

  const readHere = lookup.rows.filter((r) => r.readHere).length

  return (
    <Main>
      <div className="admin-ui font-ui">
        <PageHeader>
          Frequency Index: <span className="italic">{lookup.term}</span>
        </PageHeader>
        <BackLink />

        <dl className="mb-6 grid max-w-2xl grid-cols-[max-content_1fr] gap-x-6 gap-y-1">
          <dt className="font-semibold">Normalizer</dt>
          <dd>{lookup.normalizer}</dd>
          <dt className="font-semibold">Exclusions</dt>
          <dd>
            {lookup.exclusions || <span className="text-gray-500">none</span>}
          </dd>
          <dt className="font-semibold">Multiplier</dt>
          <dd>{formatCount(lookup.multiplier)}</dd>
          <dt className="font-semibold">Counts from</dt>
          <dd>
            {lookup.backend === "browser"
              ? "google.com, read by hand"
              : lookup.backend}
            {lookup.hl && (
              <Fragment>
                {" "}
                (hl={lookup.hl}
                {lookup.gl && `, gl=${lookup.gl}`})
              </Fragment>
            )}
          </dd>
          <dt className="font-semibold">Recorded</dt>
          <dd>
            {new Date(lookup.created).toLocaleDateString("en-CA")} by{" "}
            {userName(lookup.user)}
          </dd>
          {lookup.updated && (
            <Fragment>
              <dt className="font-semibold">Corrected</dt>
              <dd>
                {new Date(lookup.updated).toLocaleDateString("en-CA")} by{" "}
                {userName(lookup.updatedUser)}
              </dd>
            </Fragment>
          )}
        </dl>

        <LookupRowsTable
          rows={lookup.rows}
          multiplier={lookup.multiplier}
          history={{
            normalizer: lookup.normalizer,
            days: SPARKLINE_DAYS,
            series: normalizerHistory,
          }}
        />

        <p className="mt-3 text-sm text-gray-600">
          The index is computed from the stored counts each time this page is
          shown, so a corrected normalizer count is reflected here at once.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to={`/frequency-index/${lookup.id}/edit`}
            asButton
            appearance="primary"
            buttonVariant="outline"
          >
            <FAIcon iconName="fa-pen" /> Correct the counts
          </Link>
          <Link
            to={`/frequency-index?${repeatParams}`}
            asButton
            appearance="primary"
            buttonVariant="outline"
          >
            <FAIcon iconName="fa-rotate-right" /> Repeat this lookup
          </Link>
          <Link to="/frequency-index" asButton appearance="primary">
            <FAIcon iconName="fa-magnifying-glass" /> Look up another term
          </Link>
          <Form
            method="post"
            className="ml-auto"
            onSubmit={(e) => {
              const extra =
                readHere > 0
                  ? ` The ${readHere} normalizer count${
                      readHere === 1 ? "" : "s"
                    } read during it will be deleted too, unless another lookup reused them.`
                  : ""
              if (
                !window.confirm(
                  `Delete the lookup of “${lookup.term}”? This cannot be undone.${extra}`
                )
              )
                e.preventDefault()
            }}
          >
            <input type="hidden" name="intent" value="delete" />
            <Button
              type="submit"
              appearance="danger"
              variant="outline"
              disabled={deleting}
            >
              <DeleteIcon /> {deleting ? "Deleting…" : "Delete this lookup"}
            </Button>
          </Form>
        </div>
      </div>
    </Main>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
