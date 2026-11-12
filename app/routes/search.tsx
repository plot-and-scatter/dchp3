import { Fragment } from "react"
import { enumValues } from "~/utils/inputUtils"
import { Form, useLoaderData } from "react-router"
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
import type { LoaderFunctionArgs } from "react-router"
import { EDITIONS } from "~/editions"
import { getEditionId } from "~/editions/edition.server"
import { useEdition } from "~/editions/EditionPage"
import { BASE_CANADANISM_TYPES } from "~/types/CanadianismTypeEnum"

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

export async function loader({ request }: LoaderFunctionArgs) {
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
    const edition = EDITIONS[getEditionId()]
    const searchResults: AllSearchResults = await getSearchResults(
      parsedParams.value,
      isUserAdmin,
      { ignoreCategories: !edition.hasCanadianismTypes }
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

  // An archive has one database and, for DCHP-1, no Canadianism types. The
  // boxes that would offer nothing are replaced by hidden inputs so the form
  // still satisfies the schema; the loader ignores categories for DCHP-1.
  const edition = useEdition()
  const showDatabases = edition.databases.length > 1
  const showFilters =
    showDatabases || edition.hasCanadianismTypes || !!data?.isUserAdmin

  return (
    <Main center>
      <PageHeader>
        Search entries{searchTerm && ":"} {searchTerm}
      </PageHeader>
      <Form {...getFormProps(form)} method="get">
        <div className="flex w-full max-w-4xl flex-col gap-5">
          <SearchTermInput
            fields={fields}
            data={data}
            action={
              <ActionButton
                size="large"
                name="attribute"
                value={attribute}
                // Stretches to the term box's height on the same row.
                className="whitespace-nowrap py-0"
                formActionPath={SEARCH_PATH}
              >
                <FAIcon iconName="fa-search" className="mr-2" /> Search
              </ActionButton>
            }
          />
          {/* An archive edition with one database, or no Canadianism types,
              submits those as hidden inputs rather than showing a filter with
              nothing to choose. */}
          {!showDatabases &&
            edition.databases.map((db) => (
              <input
                key={db.value}
                type="hidden"
                name="database"
                value={db.value}
              />
            ))}
          {!edition.hasCanadianismTypes && (
            <Fragment>
              {BASE_CANADANISM_TYPES.map((type) => (
                <input
                  key={type}
                  type="hidden"
                  name="canadianismType"
                  value={type}
                />
              ))}
              <input type="hidden" name="nonCanadianism" value="on" />
            </Fragment>
          )}
          {/* Filters: optional refinements, so they sit under the term rather
              than beside it. All boxes default to checked, so leaving them
              alone searches everything, as before. DCHP-1 has none to show. */}
          {showFilters && (
            <fieldset className="border-t border-gray-300 pt-4">
              <legend className="pr-3 text-sm uppercase tracking-wide text-gray-500">
                Filters
              </legend>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {showDatabases && (
                  <DatabaseCheckboxes
                    fields={fields}
                    options={edition.databases}
                  />
                )}
                {edition.hasCanadianismTypes && (
                  <CanadianismTypeCheckboxes
                    fields={fields}
                    searchParams={isResult ? data.searchParams : undefined}
                  />
                )}
                {/* Editors only; an archive has none. */}
                {data?.isUserAdmin && (
                  <EditingStatusCheckboxes fields={fields} />
                )}
              </div>
            </fieldset>
          )}
        </div>
        {isResult && <SearchResult data={data} searchTerm={searchTerm || ""} />}
      </Form>
    </Main>
  )
}
