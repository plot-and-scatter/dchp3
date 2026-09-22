import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router"
import { redirect, useActionData, useLoaderData } from "react-router"
import { parseWithZod } from "@conform-to/zod"
import Main from "~/components/elements/Layouts/Main"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import FrequencyIndexForm from "~/components/frequencyIndex/FrequencyIndexForm"
import RecentLookups from "~/components/frequencyIndex/RecentLookups"
import {
  DEFAULT_MULTIPLIER,
  DEFAULT_NORMALIZER,
  FrequencyLookupSchema,
  MULTIPLIERS,
} from "~/models/frequencyIndex"
import {
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

  const [recentNormalizerCounts, recentLookups] = await Promise.all([
    getRecentNormalizerCounts(),
    listRecentFrequencyLookups(),
  ])

  return { defaults, recentNormalizerCounts, recentLookups }
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

export default function FrequencyIndexPage() {
  const { defaults, recentNormalizerCounts, recentLookups } =
    useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  return (
    <Main>
      <PageHeader>Frequency Index</PageHeader>
      <p className="mb-6 max-w-3xl">
        Compare how often a term appears on the web of each English-speaking
        country, relative to a normalizer word. Google will not give us these
        counts by any programmatic route, so the tool opens the searches for you
        and you type in the &ldquo;About N results&rdquo; figure from each one.
      </p>

      <FrequencyIndexForm
        defaults={defaults}
        recentNormalizerCounts={recentNormalizerCounts}
        lastResult={actionData?.kind === "invalid" ? actionData.result : null}
      />

      <RecentLookups lookups={recentLookups} />
    </Main>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
