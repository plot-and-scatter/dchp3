import { useState } from "react"
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  Form,
  data,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router"
import { parseWithZod } from "@conform-to/zod"
import Main from "~/components/elements/Layouts/Main"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import Button from "~/components/elements/LinksAndButtons/Button"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import FAIcon from "~/components/elements/Icons/FAIcon"
import TopLabelledField from "~/components/bank/TopLabelledField"
import {
  FrequencyLookupEditSchema,
  MULTIPLIERS,
  type NormalizerChange,
  digitsOnly,
  formatCount,
  formatIndex,
  frequencyIndex,
  googleSearchUrl,
  parseCount,
} from "~/models/frequencyIndex"
import {
  type FrequencyLookupRowView,
  getFrequencyLookup,
  getOtherUsersOfCounts,
  updateFrequencyLookupCounts,
} from "~/models/frequencyIndex.server"
import { userName } from "~/components/frequencyIndex/userName"
import {
  getUserIdAndEmail,
  redirectIfUserLacksPermission,
} from "~/services/auth/session.server"
import { FREQUENCY_INDEX_PERMISSION } from "./index"

// Correcting a saved lookup, for example a count typed with a digit missing.
// Only the counts and the multiplier can change here; the term, normalizer
// and exclusions define the stored queries, so a mistake in those is a new
// lookup, not an edit.
//
// A normalizer count is a shared observation. Changing one here is either a
// correction of that observation, which changes every lookup that used it,
// or a fresh reading for this lookup alone. When no other lookup uses the
// observation the two are the same and no choice is offered.

const lookupId = (params: { id?: string }) => {
  const id = Number(params.id)
  return Number.isInteger(id) ? id : null
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await redirectIfUserLacksPermission(request, FREQUENCY_INDEX_PERMISSION)

  const id = lookupId(params)
  const lookup = id === null ? null : await getFrequencyLookup(id)
  if (!lookup) throw data({ message: "Lookup not found" }, { status: 404 })

  const otherUsers = await getOtherUsersOfCounts(lookup.id)
  return { lookup, otherUsers }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await redirectIfUserLacksPermission(request, FREQUENCY_INDEX_PERMISSION)

  const id = lookupId(params)
  if (id === null) throw data({ message: "Lookup not found" }, { status: 404 })

  const submission = parseWithZod(await request.formData(), {
    schema: FrequencyLookupEditSchema,
  })
  if (submission.status !== "success") {
    return { kind: "invalid" as const, result: submission.reply() }
  }

  const { userId } = await getUserIdAndEmail(request)
  const updated = await updateFrequencyLookupCounts({
    id,
    input: submission.value,
    userId,
  })
  if (updated === null)
    throw data({ message: "Lookup not found" }, { status: 404 })

  return redirect(`/frequency-index/${id}`)
}

export default function EditFrequencyLookupPage() {
  const { lookup, otherUsers } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const saving = navigation.state !== "idle"

  const [multiplier, setMultiplier] = useState(lookup.multiplier)
  const [counts, setCounts] = useState<
    Record<
      string,
      {
        termHits: string
        normalizerHits: string
        normalizerChange: NormalizerChange
      }
    >
  >(
    Object.fromEntries(
      lookup.rows.map((r) => [
        r.domainKey,
        {
          termHits: String(r.termHits),
          normalizerHits: String(r.normalizerHits),
          normalizerChange: "correct",
        },
      ])
    )
  )
  const setChange = (key: string, normalizerChange: NormalizerChange) =>
    setCounts((prev) => ({
      ...prev,
      [key]: { ...prev[key], normalizerChange },
    }))

  const setCount = (
    key: string,
    field: "termHits" | "normalizerHits",
    raw: string
  ) =>
    setCounts((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: digitsOnly(raw) },
    }))

  const changed =
    multiplier !== lookup.multiplier ||
    lookup.rows.some(
      (r) =>
        parseCount(counts[r.domainKey].termHits) !== r.termHits ||
        parseCount(counts[r.domainKey].normalizerHits) !== r.normalizerHits
    )
  const complete = lookup.rows.every(
    (r) =>
      parseCount(counts[r.domainKey].termHits) !== null &&
      (parseCount(counts[r.domainKey].normalizerHits) ?? 0) > 0
  )

  const errors =
    actionData?.kind === "invalid" && actionData.result.error
      ? Object.entries(actionData.result.error).flatMap(([field, msgs]) =>
          (msgs ?? []).map((m) => (field ? `${field}: ${m}` : m))
        )
      : []

  const inputClass =
    "my-0 w-40 rounded border border-gray-300 px-3 py-2 tabular-nums"

  return (
    <Main>
      <div className="admin-ui font-ui">
        <PageHeader>
          Correct the counts for <span className="italic">{lookup.term}</span>
        </PageHeader>

        <p className="mb-6 max-w-3xl">
          Change any count that was typed wrongly and save. The term, normalizer
          and exclusions cannot change, because the saved searches were built
          from them; if one of those is wrong,{" "}
          <Link to="/frequency-index">record a new lookup</Link> instead. Each
          count links to the search it came from.
        </p>

        {errors.length > 0 && (
          <div
            role="alert"
            className="my-4 max-w-xl border-l-4 border-red-500 bg-red-50 p-4"
          >
            <p className="font-semibold">The correction was not saved.</p>
            <ul className="list-disc pl-5">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        <Form method="post">
          <div className="max-w-xs">
            <TopLabelledField
              label="Multiplier"
              field={
                <select
                  name="multiplier"
                  value={multiplier}
                  onChange={(e) => setMultiplier(Number(e.target.value))}
                  className="my-0 w-full rounded border border-gray-300 px-4 py-2"
                >
                  {MULTIPLIERS.map((m) => (
                    <option key={m} value={m}>
                      {formatCount(m)}
                    </option>
                  ))}
                </select>
              }
            />
          </div>

          <table className="mt-6 w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-gray-400">
                <th className="py-2 pr-4">Domain</th>
                <th className="py-2 pr-4">Term hits</th>
                <th className="py-2 pr-4">Normalizer hits</th>
                <th className="py-2 pr-4 text-right">Saved index</th>
                <th className="py-2 pr-4 text-right">
                  New index (&times;{formatCount(multiplier)})
                </th>
              </tr>
            </thead>
            <tbody>
              {lookup.rows.map((r, i) => {
                const c = counts[r.domainKey]
                const index = frequencyIndex(
                  parseCount(c.termHits),
                  parseCount(c.normalizerHits),
                  multiplier
                )
                const rowChanged =
                  parseCount(c.termHits) !== r.termHits ||
                  parseCount(c.normalizerHits) !== r.normalizerHits
                return (
                  <tr key={r.id} className="border-b border-gray-200 align-top">
                    <td className="py-3 pr-4">
                      <div className="font-semibold">{r.domainLabel}</div>
                      <div className="text-sm text-gray-500">
                        {r.siteClause}
                      </div>
                      <input
                        type="hidden"
                        name={`rows[${i}].domainKey`}
                        value={r.domainKey}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <CountField
                        name={`rows[${i}].termHits`}
                        value={c.termHits}
                        saved={r.termHits}
                        query={r.termQuery}
                        className={inputClass}
                        onChange={(v) => setCount(r.domainKey, "termHits", v)}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <CountField
                        name={`rows[${i}].normalizerHits`}
                        value={c.normalizerHits}
                        saved={r.normalizerHits}
                        query={r.normalizerQuery}
                        className={inputClass}
                        onChange={(v) =>
                          setCount(r.domainKey, "normalizerHits", v)
                        }
                      />
                      <NormalizerChangeChoice
                        row={r}
                        changed={
                          parseCount(c.normalizerHits) !== r.normalizerHits
                        }
                        others={otherUsers[r.normalizerCount.id] ?? []}
                        name={`rows[${i}].normalizerChange`}
                        value={c.normalizerChange}
                        onChange={(v) => setChange(r.domainKey, v)}
                      />
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums text-gray-500">
                      {formatIndex(r.frequencyIndex)}
                    </td>
                    <td
                      className={
                        "py-3 pr-4 text-right text-lg font-semibold tabular-nums" +
                        (rowChanged || multiplier !== lookup.multiplier
                          ? ""
                          : " text-gray-400")
                      }
                    >
                      {formatIndex(index) || <span>&ndash;</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Button
              type="submit"
              appearance="success"
              disabled={!changed || !complete || saving}
            >
              <SaveIcon /> {saving ? "Saving…" : "Save corrections"}
            </Button>
            <Link to={`/frequency-index/${lookup.id}`}>Cancel</Link>
            {!changed && (
              <span className="text-sm text-gray-600">
                Nothing changed yet.
              </span>
            )}
          </div>
        </Form>
      </div>
    </Main>
  )
}

function NormalizerChangeChoice({
  row,
  changed,
  others,
  name,
  value,
  onChange,
}: {
  row: FrequencyLookupRowView
  changed: boolean
  others: { id: number; term: string }[]
  name: string
  value: NormalizerChange
  onChange: (v: NormalizerChange) => void
}) {
  const c = row.normalizerCount
  const origin = row.readHere
    ? null
    : c.lookup
    ? `Reused from the lookup of “${c.lookup.term}” on ${c.observed}.`
    : `From ${c.source}, ${c.observed}, recorded by ${userName(c.user)}.`
  if (!changed)
    return origin ? (
      <div className="mt-1 text-sm text-gray-500">{origin}</div>
    ) : null
  if (others.length === 0)
    return (
      <div className="mt-1 text-sm text-gray-500">
        <input type="hidden" name={name} value="correct" />
        {origin && <span>{origin} </span>}
        No other lookup uses this count, so it is simply corrected.
      </div>
    )
  const names = others.map((o) => `“${o.term}”`).join(", ")
  return (
    <fieldset className="mt-2 rounded border border-amber-400 bg-amber-50 p-2 text-sm">
      <legend className="px-1 font-semibold">
        {others.length === 1
          ? `Also used by the lookup of ${names}`
          : `Also used by ${others.length} other lookups: ${names}`}
      </legend>
      <label className="flex items-start gap-2">
        <input
          type="radio"
          name={name}
          value="correct"
          checked={value === "correct"}
          onChange={() => onChange("correct")}
          className="mt-1"
        />
        <span>
          <strong>Correct the reading.</strong> It was typed wrongly; every
          lookup that used it changes too.
        </span>
      </label>
      <label className="mt-1 flex items-start gap-2">
        <input
          type="radio"
          name={name}
          value="new"
          checked={value === "new"}
          onChange={() => onChange("new")}
          className="mt-1"
        />
        <span>
          <strong>Take a fresh reading.</strong> Google gives a different number
          now; only this lookup uses the new one.
        </span>
      </label>
    </fieldset>
  )
}

function CountField({
  name,
  value,
  saved,
  query,
  className,
  onChange,
}: {
  name: string
  value: string
  saved: number
  query: string
  className: string
  onChange: (value: string) => void
}) {
  const n = parseCount(value)
  const changed = n !== saved
  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={(e) => {
            e.preventDefault()
            onChange(e.clipboardData.getData("text"))
          }}
          inputMode="numeric"
          autoComplete="off"
          className={
            className + (changed ? " border-amber-500 bg-amber-50" : "")
          }
        />
        <a
          href={googleSearchUrl(query)}
          target="_blank"
          rel="noreferrer"
          title={query}
          className="text-sm underline"
        >
          <FAIcon iconName="fa-arrow-up-right-from-square" margin="mr-0.5" />
          open
        </a>
      </div>
      <div className="mt-1 text-sm tabular-nums text-gray-500">
        {changed ? (
          <span>
            {formatCount(n) || "empty"}, was {formatCount(saved)}
          </span>
        ) : (
          formatCount(n)
        )}
      </div>
    </div>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
