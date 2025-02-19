import { enumValues } from "~/utils/inputUtils"
import { Form, useLoaderData } from "@remix-run/react"
import { getFormProps, useForm } from "@conform-to/react"
import { getSearchResults } from "~/models/search.server"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { parseWithZod } from "@conform-to/zod"
import { SearchResultEnum } from "./search/searchResultEnum"
import { userHasPermission } from "~/services/auth/session.server"
import { z } from "zod"
import ActionButton from "~/components/elements/LinksAndButtons/ActionButton"
import CanadianismTypeCheckboxes from "~/components/search/CanadianismTypeCheckboxes"
import DatabaseCheckboxes from "~/components/search/DatabaseCheckboxes"
import EditingStatusCheckboxes from "~/components/search/EditingStatusCheckboxes"
import FAIcon from "~/components/elements/Icons/FAIcon"
import Main from "~/components/elements/Layouts/Main"
import SearchResult from "~/components/search/Results/SearchResult"
import SearchTermInput from "~/components/search/SearchTermInput"
import type { AllSearchResults } from "~/models/search.server"
import type { LoaderArgs } from "@remix-run/server-runtime"

const searchActionSchema = z.object({
  searchTerm: z
    .string({
      required_error:
        "Search term must be one or more characters (use * to search all)",
    })
    .min(1),
  database: z.array(z.string()).min(1, "You must select at least one database"),
  canadianismType: z.array(z.string()),
  editingStatus: z.array(z.string()).optional(),
  nonCanadianism: z.boolean().nullish(),
  caseSensitive: z.boolean().nullish(),
  page: z.number().int().positive().default(1),
  attribute: z.enum(enumValues(SearchResultEnum) as [string, ...string[]]),
})

export type SearchActionSchema = z.infer<typeof searchActionSchema>

export async function loader({ request }: LoaderArgs) {
  const parsedParams = parseWithZod(new URL(request.url).searchParams, {
    schema: searchActionSchema,
  })

  const isUserAdmin = await userHasPermission(request, "det:viewEdits")

  if (parsedParams.status !== "success") {
    return {
      isUserAdmin,
    }
  }

  const url = new URL(request.url)
  const searchTerm = parsedParams.value.searchTerm

  if (searchTerm) {
    const searchResults: AllSearchResults = await getSearchResults(
      parsedParams.value,
      isUserAdmin
    )

    return { isUserAdmin, searchResults, searchParams: parsedParams.value, url }
  }

  return { isUserAdmin }
}

const SEARCH_PATH = "/search"

const isSearchResult = (
  data: any
): data is {
  searchResults: AllSearchResults
  searchParams: any
  url: string
} => {
  console.log("data", data)

  return !!data.searchParams
}

export default function SearchPage() {
  const data = useLoaderData<typeof loader>()

  const [form, fields] = useForm({
    shouldValidate: "onInput", // Run the same validation logic on client
    onValidate({ formData }) {
      const parsing = parseWithZod(formData, { schema: searchActionSchema })
      return parsing
    },
  })
  const isResult = isSearchResult(data)

  const searchTerm = isResult ? data.searchParams?.searchTerm : undefined

  const attribute = isResult
    ? data.searchParams.attribute
    : SearchResultEnum.HEADWORD

  return (
    <Main center>
      <PageHeader>
        Search entries{searchTerm && ":"} {searchTerm}
      </PageHeader>
      <Form {...getFormProps(form)} method="get">
        <div className="flex w-full max-w-4xl flex-col gap-4 md:flex-row lg:gap-6">
          <div className="grow-1 flex w-full flex-col gap-4 md:flex-row">
            <SearchTermInput fields={fields} data={data} />
          </div>
          <div className="flex w-fit shrink-0 grow-0 flex-row gap-4">
            <DatabaseCheckboxes fields={fields} />
            <CanadianismTypeCheckboxes
              fields={fields}
              searchParams={isResult ? data.searchParams : undefined}
            />
            {data?.isUserAdmin && <EditingStatusCheckboxes fields={fields} />}
          </div>
          <div className="max-w-fit text-center lg:text-start">
            <ActionButton
              size="large"
              name="attribute"
              value={attribute}
              className="mx-auto w-fit whitespace-nowrap"
              formActionPath={SEARCH_PATH}
            >
              <FAIcon iconName="fa-search" className="mr-2" /> Search
            </ActionButton>
          </div>
        </div>
        {isResult && <SearchResult data={data} searchTerm={searchTerm || ""} />}
      </Form>
    </Main>
  )
}
