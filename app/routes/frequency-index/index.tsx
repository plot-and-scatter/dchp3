import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router"
import { redirect, useActionData, useLoaderData } from "react-router"
import { parseWithZod } from "@conform-to/zod"
import Main from "~/components/elements/Layouts/Main"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import FrequencyIndexForm from "~/components/frequencyIndex/FrequencyIndexForm"
import HelpPanel from "~/components/frequencyIndex/HelpPanel"
import Button from "~/components/elements/LinksAndButtons/Button"
import FAIcon from "~/components/elements/Icons/FAIcon"
import { useEffect, useState } from "react"
import RecentLookups from "~/components/frequencyIndex/RecentLookups"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import {
  DEFAULT_MULTIPLIER,
  DEFAULT_NORMALIZER,
  FrequencyLookupSchema,
  MULTIPLIERS,
} from "~/models/frequencyIndex"
import {
  getNormalizerHistories,
  getRecentNormalizerCounts,
  listRecentFrequencyLookups,
  saveFrequencyLookup,
} from "~/models/frequencyIndex.server"
import {
  getUserIdAndEmail,
  redirectIfUserLacksPermission,
} from "~/services/auth/session.server"
import type { AuthPermission } from "~/services/auth/AuthRole"

export const FREQUENCY_INDEX_PERMISSION: AuthPermission = "det:frequencyIndex"

/** How far back the sparklines under the form look. */
export const SPARKLINE_DAYS = 90

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await redirectIfUserLacksPermission(request, FREQUENCY_INDEX_PERMISSION)

  // A saved lookup links back here with its inputs in the query string so it
  // can be repeated, for example after a week when the counts have moved.
  const params = new URL(request.url).searchParams
  const multiplierParam = Number(params.get("multiplier"))
  const defaults = {
    term: params.get("term") ?? "",
    normalizer: params.get("normalizer") || DEFAULT_NORMALIZER,
    exclusions: params.get("exclusions") ?? "",
    multiplier: (MULTIPLIERS as readonly number[]).includes(multiplierParam)
      ? multiplierParam
      : DEFAULT_MULTIPLIER,
  }

  const since = new Date(Date.now() - SPARKLINE_DAYS * 24 * 3600 * 1000)
  const [recentNormalizerCounts, recentLookups, normalizerHistories] =
    await Promise.all([
      getRecentNormalizerCounts(),
      listRecentFrequencyLookups(),
      getNormalizerHistories(since),
    ])

  return {
    defaults,
    recentNormalizerCounts,
    recentLookups,
    normalizerHistories,
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await redirectIfUserLacksPermission(request, FREQUENCY_INDEX_PERMISSION)

  const submission = parseWithZod(await request.formData(), {
    schema: FrequencyLookupSchema,
  })
  if (submission.status !== "success") {
    return { kind: "invalid" as const, result: submission.reply() }
  }

  const { userId } = await getUserIdAndEmail(request)
  const id = await saveFrequencyLookup({ input: submission.value, userId })
  return redirect(`/frequency-index/${id}`)
}

const HELP_OPEN_KEY = "dchp3.frequencyIndex.helpOpen"
/** Shared by the Help and Close buttons so one lands exactly on the other. */
const HELP_BUTTON_CLASS = "w-24 text-center"

export default function FrequencyIndexPage() {
  const {
    defaults,
    recentNormalizerCounts,
    recentLookups,
    normalizerHistories,
  } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  // Closed by default so the form is uncluttered for people who know it;
  // the choice is remembered in this browser. Read after hydration so the
  // server and first client render agree.
  const [helpOpen, setHelpOpen] = useState(false)
  useEffect(() => {
    try {
      setHelpOpen(window.localStorage.getItem(HELP_OPEN_KEY) === "1")
    } catch {
      // Storage unavailable: stay closed.
    }
  }, [])
  const toggleHelp = (open: boolean) => {
    setHelpOpen(open)
    try {
      window.localStorage.setItem(HELP_OPEN_KEY, open ? "1" : "0")
    } catch {
      // Nothing to do.
    }
  }

  return (
    <Main>
      {/* Same typeface rule as the admin area: sans for the interface,
          serif for headings. See .admin-ui in app/styles/additional.css. */}
      <div className="admin-ui font-ui">
        {/* The help column exists whether or not the panel is open, so the
            title never moves and the Help button sits exactly where the
            panel's Close button will be: both are HELP_BUTTON_CLASS wide, and
            when closed the button is positioned absolutely at the panel's
            border-plus-padding inset (17px), taking no width from the form.
            On a narrow screen it is in flow, above the title. */}
        <div className="relative flex flex-col xl:flex-row xl:items-start xl:gap-8">
          <div className="min-w-0 flex-1 xl:order-1">
            <PageHeader>Frequency Index</PageHeader>
            <p className="mb-6 max-w-4xl">
              Compare how often a term appears on the web of each
              English-speaking country, relative to a normalizer word.{" "}
              <Link to="/frequency-index/normalizers">
                See how the normalizer counts have moved over time.
              </Link>
            </p>
            <FrequencyIndexForm
              defaults={defaults}
              recentNormalizerCounts={recentNormalizerCounts}
              normalizerHistories={normalizerHistories}
              sparklineDays={SPARKLINE_DAYS}
              lastResult={
                actionData?.kind === "invalid" ? actionData.result : null
              }
            />
            <RecentLookups lookups={recentLookups} />
          </div>
          {helpOpen ? (
            <aside className="mb-8 xl:sticky xl:top-28 xl:order-2 xl:mb-0 xl:w-96 xl:shrink-0">
              <HelpPanel
                onClose={() => toggleHelp(false)}
                closeButtonClassName={HELP_BUTTON_CLASS}
              />
            </aside>
          ) : (
            <div className="flex justify-end pb-2 xl:absolute xl:right-[17px] xl:top-[17px] xl:pb-0">
              <Button
                type="button"
                appearance="primary"
                variant="outline"
                size="small"
                onClick={() => toggleHelp(true)}
                className={HELP_BUTTON_CLASS}
              >
                <FAIcon iconName="fa-circle-question" /> Help
              </Button>
            </div>
          )}
        </div>
      </div>
    </Main>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
