import { BASE_CANADANISM_TYPES } from "~/types/CanadianismTypeEnum"
import { Form, useActionData, useLoaderData } from "@remix-run/react"
import { getFormProps, useForm } from "@conform-to/react"
import { getSearchResults } from "~/models/search.server"
import { json } from "@remix-run/server-runtime"
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
import type { LoaderArgs, type ActionArgs } from "@remix-run/server-runtime"

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
  attribute: z
    .array(z.string())
    .min(1, "You must select at least one data type"),
})

export async function action({ request }: ActionArgs) {
  // This action is only for validating the form. The actual search is done in
  // the loader, because we're using GET for the search.

  const formData = await request.formData()

  const submission = parseWithZod(formData, { schema: searchActionSchema })

  if (submission.status !== "success") {
    return json(submission.reply(), {
      status: submission.status === "error" ? 400 : 200,
    })
  }

  return json(submission.reply(), { status: 200 })
}

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const searchParams = url.searchParams

  const params = parseWithZod(searchParams, { schema: searchActionSchema })

  console.log("PARAMS", params)

  console.log("searchParams", searchParams)

  const searchTerm = url.searchParams.get("searchTerm")
  const caseSensitive: boolean =
    url.searchParams.get("caseSensitive") === "true"
  const pageNumber: string | undefined =
    url.searchParams.get("pageNumber") ?? undefined
  const dchpVersions: string[] | undefined = url.searchParams.getAll("database")

  const canadianismTypes: string[] | undefined =
    url.searchParams.getAll("canadianismType")

  const isUserAdmin = await userHasPermission(request, "det:viewEdits")

  if (searchTerm) {
    const searchResults: AllSearchResults = await getSearchResults({
      text: searchTerm,
      page: pageNumber,
      caseSensitive,
      dchpVersions,
      canadianismTypesArg: canadianismTypes,
      isUserAdmin,
      nonCanadianismOnly: url.searchParams.get("nonCanadianism") === "true",
    })

    return { searchResults, searchParams: params }
  } else {
    return null
  }
}

const SEARCH_PATH = "/search"

export default function SearchPage() {
  const data = useLoaderData<typeof loader>()
  const lastResult = useActionData<typeof action>()

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onInput", // Run the same validation logic on client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: searchActionSchema })
    },
  })
  const hasResults = data !== null

  const searchTerm = data?.searchParams.payload.searchTerm

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
                defaultValue={data?.searchParams?.payload.searchTerm}
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
                    defaultChecked: true,
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
                    defaultChecked: false,
                  },
                ]}
              />
            </div>
          </div>
          <div className="max-w-fit text-center lg:text-start">
            <ActionButton
              size="large"
              name="attribute"
              value={
                data?.searchParams.payload.attribute ?? SearchResultEnum.ALL
              }
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
              {data.searchParams.payload.caseSensitive !== "undefined" && (
                <> (case sensitive)</>
              )}
            </SecondaryHeader>
            <div>
              <div className="w-full">
                <SearchResults
                  data={data.searchResults}
                  text={searchTerm || ""}
                  pageNumber={data.searchParams.payload.pageNumber}
                  searchAttribute={data.searchParams.payload.attribute}
                />
              </div>
            </div>
          </div>
        )}
      </Form>
    </Main>
  )
}
