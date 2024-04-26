import { BASE_CANADANISM_TYPES } from "~/types/CanadianismTypeEnum"
import { Form, useLoaderData } from "@remix-run/react"
import { getFormProps, useForm } from "@conform-to/react"
import { getSearchResults } from "~/models/search.server"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { parseWithZod } from "@conform-to/zod"
import { SearchResultEnum } from "./search/searchResultEnum"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import { userHasPermission } from "~/services/auth/session.server"
import { z } from "zod"
import ActionButton from "~/components/elements/LinksAndButtons/ActionButton"
import FAIcon from "~/components/elements/Icons/FAIcon"
import Input from "~/components/bank/Input"
import Main from "~/components/elements/Layouts/Main"
import RadioOrCheckbox from "~/components/bank/RadioOrCheckbox"
import SearchResults from "~/components/EntryEditor/SearchResults"
import type { AllSearchResults } from "~/models/search.server"
import type { InputOption } from "~/components/bank/InputOption"
import type { LoaderArgs } from "@remix-run/server-runtime"
import { enumValues } from "~/utils/inputUtils"

const searchActionSchema = z.object({
  searchTerm: z
    .string({
      required_error:
        "Search term must be one or more characters (use * to search all)",
    })
    .min(1),
  database: z.array(z.string()).min(1, "You must select at least one database"),
  canadianismType: z.array(z.string()),
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

  if (parsedParams.status !== "success") {
    return null
  }

  const url = new URL(request.url)

  const searchTerm = parsedParams.value.searchTerm

  if (searchTerm) {
    const isUserAdmin = await userHasPermission(request, "det:viewEdits")
    const searchResults: AllSearchResults = await getSearchResults(
      parsedParams.value,
      isUserAdmin
    )

    return { searchResults, searchParams: parsedParams.value, url }
  }
}

const SEARCH_PATH = "/search"

export default function SearchPage() {
  const data = useLoaderData<typeof loader>()

  const [form, fields] = useForm({
    shouldValidate: "onInput", // Run the same validation logic on client
    onValidate({ formData }) {
      const parsing = parseWithZod(formData, { schema: searchActionSchema })
      return parsing
    },
  })
  const hasResults = data !== null

  const searchTerm = data?.searchParams.searchTerm

  return (
    <Main center>
      <PageHeader>Search entries {searchTerm}</PageHeader>
      <Form {...getFormProps(form)} method="get">
        <div className="flex w-full max-w-4xl flex-col gap-4 md:flex-row lg:gap-6">
          <div className="grow-1 flex w-full flex-col gap-4 md:flex-row">
            <div className="flex w-full flex-col gap-2">
              <Input
                type="text"
                placeholder="Search term"
                className="border border-gray-700 p-2 text-2xl"
                name="searchTerm"
                defaultValue={data?.searchParams?.searchTerm}
                conformField={fields.searchTerm}
                autoFocus
              />
              <p className="text-sm">
                <FAIcon
                  iconStyle="far"
                  iconName="fa-lightbulb"
                  className="mr-1"
                />{" "}
                You can enter <strong>*</strong> to match all entries.
              </p>
              <div className="whitespace-nowrap">
                <RadioOrCheckbox
                  type="checkbox"
                  name="caseSensitive"
                  optionSetClassName="flex gap-x-2 mr-4"
                  conformField={fields.caseSensitive}
                  options={[
                    {
                      label: "Case sensitive search",
                      value: "on",
                      defaultChecked: false,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="flex w-fit shrink-0 grow-0 flex-row gap-4">
            <div className="flex flex-col">
              <div className="mr-4">
                <strong>Database</strong>
              </div>
              <RadioOrCheckbox
                type="checkbox"
                name="database"
                optionSetClassName="flex gap-x-2 mr-4"
                direction="vertical"
                conformField={fields.database}
                options={[
                  { label: "DCHP-1", value: "dchp1", defaultChecked: true },
                  { label: "DCHP-2", value: "dchp2", defaultChecked: true },
                  { label: "DCHP-3", value: "dchp3", defaultChecked: true },
                ]}
              />
            </div>
            <div className="flex flex-col">
              <div className="mr-4">
                <strong>Canadianism type</strong>
              </div>
              <RadioOrCheckbox
                type="checkbox"
                name="canadianismType"
                optionSetClassName="flex gap-x-2 mr-4"
                direction="vertical"
                conformField={fields.canadianismType}
                disabled={fields.nonCanadianism?.value === "on"}
                options={
                  BASE_CANADANISM_TYPES.map((canadianismType) => ({
                    label: canadianismType,
                    value: canadianismType,
                    defaultChecked:
                      data?.searchParams.canadianismType?.includes(
                        canadianismType
                      ) ?? true,
                  })) as InputOption[]
                }
              />
              <RadioOrCheckbox
                type="checkbox"
                name="nonCanadianism"
                optionSetClassName="flex gap-x-2 mr-4"
                direction="vertical"
                conformField={fields.nonCanadianism}
                options={[
                  {
                    label: "Non-Canadian only",
                    value: "on",
                    defaultChecked: data?.searchParams.nonCanadianism ?? false,
                  },
                ]}
              />
            </div>
          </div>
          <div className="max-w-fit text-center lg:text-start">
            <ActionButton
              size="large"
              name="attribute"
              value={data?.searchParams.attribute ?? SearchResultEnum.ALL}
              className="mx-auto w-fit whitespace-nowrap"
              formActionPath={SEARCH_PATH}
            >
              <FAIcon iconName="fa-search" className="mr-2" /> Search
            </ActionButton>
          </div>
        </div>

        {hasResults && (
          <div className="mt-5 w-full border-t-2 border-gray-500 pt-5 lg:w-fit">
            <SecondaryHeader>
              Search results for &ldquo;{searchTerm}
              &rdquo;
              {data.searchParams.caseSensitive !== undefined && (
                <> (case sensitive)</>
              )}
            </SecondaryHeader>
            <div>
              <div className="w-full">
                <SearchResults
                  data={data.searchResults}
                  text={searchTerm || ""}
                  page={data.searchParams.page}
                  searchAttribute={data.searchParams.attribute}
                  url={data.url}
                />
              </div>
            </div>
          </div>
        )}
      </Form>
    </Main>
  )
}
