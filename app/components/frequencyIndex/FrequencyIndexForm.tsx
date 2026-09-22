import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Form, useNavigation } from "react-router"
import type { SubmissionResult } from "@conform-to/react"
import clsx from "clsx"
import Button from "~/components/elements/LinksAndButtons/Button"
import Input from "~/components/bank/Input"
import TopLabelledField from "~/components/bank/TopLabelledField"
import KeyboardGuide from "./KeyboardGuide"
import {
  FREQUENCY_DOMAINS,
  MULTIPLIERS,
  digitsOnly,
  formatCount,
  formatIndex,
  frequencyIndex,
  googleSearchUrl,
  normalizeExclusions,
  normalizerQuery,
  parseCount,
  termQuery,
} from "~/models/frequencyIndex"
import type { RecentNormalizerCounts } from "~/models/frequencyIndex.server"

type Defaults = {
  term: string
  normalizer: string
  exclusions: string
  multiplier: number
}

type Props = {
  defaults: Defaults
  recentNormalizerCounts: RecentNormalizerCounts
  lastResult: SubmissionResult | null
}

type RowState = {
  termHits: string
  normalizerHits: string
  /** Row id the normalizer count was copied from, until the student edits it. */
  reusedFromId: number | null
  reusedFrom: { created: string; term: string } | null
}

/** The inputs the table was built for; links and counts belong to these. */
type Snapshot = { term: string; normalizer: string; exclusions: string }

const emptyRows = (): Record<string, RowState> =>
  Object.fromEntries(
    FREQUENCY_DOMAINS.map((d) => [
      d.key,
      {
        termHits: "",
        normalizerHits: "",
        reusedFromId: null,
        reusedFrom: null,
      },
    ])
  )

// Each named target reuses its own tab, so clicking "Open all" twice does
// not double the number of tabs. The single-field flow uses one shared
// target because the student closes that tab before opening the next.
const SINGLE_TARGET = "dchp-google"
const targetFor = (key: string) => `dchp-google-${key}`

export default function FrequencyIndexForm({
  defaults,
  recentNormalizerCounts,
  lastResult,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const navigation = useNavigation()
  const saving = navigation.state !== "idle"

  const [term, setTerm] = useState(defaults.term)
  const [normalizer, setNormalizer] = useState(defaults.normalizer)
  const [exclusions, setExclusions] = useState(defaults.exclusions)
  const [multiplier, setMultiplier] = useState(defaults.multiplier)
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
  const [rows, setRows] = useState<Record<string, RowState>>(emptyRows)
  const [popupsBlocked, setPopupsBlocked] = useState(false)
  const [focusFirst, setFocusFirst] = useState(0)

  const countInputs = useCallback(
    () =>
      Array.from(
        formRef.current?.querySelectorAll<HTMLInputElement>(
          "input[data-count-input]"
        ) ?? []
      ),
    []
  )

  useEffect(() => {
    if (focusFirst > 0) countInputs()[0]?.focus()
  }, [focusFirst, countInputs])

  const termInput = () =>
    formRef.current?.querySelector<HTMLInputElement>("input[name=term]")

  useEffect(() => {
    termInput()?.focus()
  }, [])

  const build = () => {
    const t = term.trim()
    if (!t) {
      termInput()?.focus()
      return
    }
    const n = normalizer.trim()
    const sameNormalizer = snapshot?.normalizer === n
    const recent = recentNormalizerCounts[n] ?? {}

    setRows((prev) =>
      Object.fromEntries(
        FREQUENCY_DOMAINS.map((d) => {
          const keep = sameNormalizer ? prev[d.key] : null
          const reuse = recent[d.key]
          const normalizerState =
            keep && keep.normalizerHits !== ""
              ? keep
              : reuse
              ? {
                  normalizerHits: String(reuse.hits),
                  reusedFromId: reuse.rowId,
                  reusedFrom: { created: reuse.created, term: reuse.term },
                }
              : { normalizerHits: "", reusedFromId: null, reusedFrom: null }
          return [d.key, { ...normalizerState, termHits: "" }]
        })
      )
    )
    setSnapshot({ term: t, normalizer: n, exclusions: exclusions.trim() })
    setFocusFirst((x) => x + 1)
  }

  const stale =
    snapshot !== null &&
    (snapshot.term !== term.trim() ||
      snapshot.normalizer !== normalizer.trim() ||
      snapshot.exclusions !== exclusions.trim())

  const queries = useMemo(() => {
    if (!snapshot) return null
    return Object.fromEntries(
      FREQUENCY_DOMAINS.map((d) => [
        d.key,
        {
          term: termQuery(snapshot.term, d, snapshot.exclusions),
          normalizer: normalizerQuery(snapshot.normalizer, d),
        },
      ])
    )
  }, [snapshot])

  const open = (url: string, target: string) => {
    const w = window.open(url, target)
    if (!w) setPopupsBlocked(true)
    else w.focus()
  }

  const openAll = (which: "term" | "normalizer") => {
    if (!queries) return
    let blocked = false
    for (const d of FREQUENCY_DOMAINS) {
      const w = window.open(
        googleSearchUrl(queries[d.key][which]),
        targetFor(`${which}-${d.key}`)
      )
      if (!w) blocked = true
    }
    if (blocked) setPopupsBlocked(true)
  }

  const setCount = (
    key: string,
    field: "termHits" | "normalizerHits",
    raw: string
  ) => {
    const value = digitsOnly(raw)
    setRows((prev) => ({
      ...prev,
      [key]:
        field === "normalizerHits"
          ? {
              ...prev[key],
              normalizerHits: value,
              reusedFromId: null,
              reusedFrom: null,
            }
          : { ...prev[key], termHits: value },
    }))
  }

  const focusAfter = (input: HTMLInputElement) => {
    const inputs = countInputs()
    const next = inputs[inputs.indexOf(input) + 1]
    if (next) next.focus()
    else
      formRef.current
        ?.querySelector<HTMLButtonElement>("button[type=submit]")
        ?.focus()
  }

  const onCountKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    url: string
  ) => {
    if (e.key !== "Enter" || e.metaKey || e.ctrlKey) return
    e.preventDefault()
    if (e.currentTarget.value === "") open(url, SINGLE_TARGET)
    else focusAfter(e.currentTarget)
  }

  const onFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  const onTopFieldKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || e.metaKey || e.ctrlKey) return
    e.preventDefault()
    build()
  }

  const filled = FREQUENCY_DOMAINS.filter(
    (d) => rows[d.key].termHits !== "" && rows[d.key].normalizerHits !== ""
  ).length
  const complete =
    snapshot !== null && !stale && filled === FREQUENCY_DOMAINS.length

  const errors = lastResult?.error
    ? Object.entries(lastResult.error).flatMap(([field, msgs]) =>
        (msgs ?? []).map((m) => (field ? `${field}: ${m}` : m))
      )
    : []

  return (
    <Form
      ref={formRef}
      method="post"
      onKeyDown={onFormKeyDown}
      className="max-w-5xl"
    >
      <KeyboardGuide />

      {errors.length > 0 && (
        <div
          role="alert"
          className="my-4 max-w-xl border-l-4 border-red-500 bg-red-50 p-4"
        >
          <p className="font-semibold">The lookup was not saved.</p>
          <ul className="list-disc pl-5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[2fr_1fr_2fr_1fr]">
        <TopLabelledField
          label="Term"
          field={
            <Input
              name="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={onTopFieldKeyDown}
              placeholder="e.g. toque"
              autoComplete="off"
              lightBorder
            />
          }
        />
        <TopLabelledField
          label="Normalizer"
          field={
            <Input
              name="normalizer"
              value={normalizer}
              onChange={(e) => setNormalizer(e.target.value)}
              onKeyDown={onTopFieldKeyDown}
              autoComplete="off"
              lightBorder
            />
          }
        />
        <TopLabelledField
          label="Exclusions (optional)"
          field={
            <Input
              name="exclusions"
              value={exclusions}
              onChange={(e) => setExclusions(e.target.value)}
              onKeyDown={onTopFieldKeyDown}
              placeholder="e.g. monkey site:example.com"
              autoComplete="off"
              lightBorder
            />
          }
        />
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
      <p className="mt-1 text-sm text-gray-600">
        Exclusions apply to the term on every domain and never to the
        normalizer. Words become <code>-word</code>; use{" "}
        <code>site:example.com</code> to drop a whole site.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="button" appearance="primary" onClick={build}>
          {snapshot ? "Rebuild table" : "Build table"}
        </Button>
        {snapshot && !stale && (
          <Fragment>
            <Button
              type="button"
              appearance="secondary"
              variant="outline"
              onClick={() => openAll("term")}
            >
              Open all seven term searches
            </Button>
            <Button
              type="button"
              appearance="secondary"
              variant="outline"
              onClick={() => openAll("normalizer")}
            >
              Open all seven normalizer searches
            </Button>
          </Fragment>
        )}
      </div>

      {stale && (
        <p className="mt-3 max-w-3xl border-l-4 border-amber-500 bg-amber-50 p-3">
          The term, normalizer or exclusions changed since the table was built.
          Rebuild it before saving; the links below still point at the old
          query. Rebuilding clears the term counts.
        </p>
      )}

      {popupsBlocked && (
        <p className="mt-3 max-w-3xl border-l-4 border-amber-500 bg-amber-50 p-3">
          Your browser blocked some of the tabs. Look for the blocked-popup icon
          at the right end of the address bar, choose &ldquo;Always allow
          pop-ups from this site&rdquo;, and click the button again. Or use the
          links in the table one at a time.
        </p>
      )}

      {snapshot && queries && (
        <Fragment>
          <table className="mt-6 w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-gray-400">
                <th className="py-2 pr-4">Domain</th>
                <th className="py-2 pr-4">
                  Term hits{" "}
                  <span className="font-normal text-gray-500">
                    ({snapshot.term}
                    {snapshot.exclusions &&
                      ` ${normalizeExclusions(snapshot.exclusions)}`}
                    )
                  </span>
                </th>
                <th className="py-2 pr-4">
                  Normalizer hits{" "}
                  <span className="font-normal text-gray-500">
                    ({snapshot.normalizer})
                  </span>
                </th>
                <th className="py-2 pr-4 text-right">
                  Index (&times;{formatCount(multiplier)})
                </th>
              </tr>
            </thead>
            <tbody>
              {FREQUENCY_DOMAINS.map((d, i) => {
                const row = rows[d.key]
                const q = queries[d.key]
                const termUrl = googleSearchUrl(q.term)
                const normUrl = googleSearchUrl(q.normalizer)
                const index = frequencyIndex(
                  parseCount(row.termHits),
                  parseCount(row.normalizerHits),
                  multiplier
                )
                return (
                  <tr
                    key={d.key}
                    className="border-b border-gray-200 align-top"
                  >
                    <td className="py-3 pr-4">
                      <div className="font-semibold">{d.label}</div>
                      <div className="text-sm text-gray-500">
                        {d.tlds.join(", ")}
                      </div>
                      <input
                        type="hidden"
                        name={`rows[${i}].domainKey`}
                        value={d.key}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <CountCell
                        name={`rows[${i}].termHits`}
                        value={row.termHits}
                        url={termUrl}
                        query={q.term}
                        target={targetFor(`term-${d.key}`)}
                        onChange={(v) => setCount(d.key, "termHits", v)}
                        onKeyDown={(e) => onCountKeyDown(e, termUrl)}
                        onOpen={() => open(termUrl, SINGLE_TARGET)}
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <CountCell
                        name={`rows[${i}].normalizerHits`}
                        value={row.normalizerHits}
                        url={normUrl}
                        query={q.normalizer}
                        target={targetFor(`normalizer-${d.key}`)}
                        onChange={(v) => setCount(d.key, "normalizerHits", v)}
                        onKeyDown={(e) => onCountKeyDown(e, normUrl)}
                        onOpen={() => open(normUrl, SINGLE_TARGET)}
                      />
                      {row.reusedFromId !== null && row.reusedFrom && (
                        <Fragment>
                          <input
                            type="hidden"
                            name={`rows[${i}].normalizerReusedFromId`}
                            value={row.reusedFromId}
                          />
                          <div className="mt-1 text-sm text-gray-500">
                            Reused from the lookup of &ldquo;
                            {row.reusedFrom.term}
                            &rdquo; on{" "}
                            {new Date(
                              row.reusedFrom.created
                            ).toLocaleDateString("en-CA")}
                            . Edit to replace.
                          </div>
                        </Fragment>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-right text-lg font-semibold tabular-nums">
                      {formatIndex(index) || (
                        <span className="text-gray-400">&ndash;</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="mt-4 flex items-center gap-4">
            <Button
              type="submit"
              appearance="success"
              disabled={!complete || saving}
            >
              {saving ? "Saving…" : "Save lookup"}
            </Button>
            <span
              className={clsx(
                "text-sm",
                complete ? "text-green-700" : "text-gray-600"
              )}
            >
              {filled} of {FREQUENCY_DOMAINS.length} domains complete
            </span>
          </div>
        </Fragment>
      )}
    </Form>
  )
}

type CountCellProps = {
  name: string
  value: string
  url: string
  query: string
  target: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onOpen: () => void
}

function CountCell({
  name,
  value,
  url,
  query,
  target,
  onChange,
  onKeyDown,
  onOpen,
}: CountCellProps) {
  const n = parseCount(value)
  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          data-count-input
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={(e) => {
            e.preventDefault()
            onChange(e.clipboardData.getData("text"))
          }}
          inputMode="numeric"
          autoComplete="off"
          placeholder="Enter to open"
          className="my-0 w-40 rounded border border-gray-300 px-3 py-2 tabular-nums"
        />
        <a
          href={url}
          target={target}
          rel="noreferrer"
          title={query}
          onClick={(e) => {
            e.preventDefault()
            onOpen()
          }}
          className="text-sm underline"
        >
          open
        </a>
      </div>
      {n !== null && (
        <div className="mt-1 text-sm tabular-nums text-gray-500">
          {formatCount(n)}
        </div>
      )}
    </div>
  )
}
