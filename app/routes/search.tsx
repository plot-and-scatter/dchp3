import {
  Form,
  Outlet,
  useActionData,
  useParams,
  useSearchParams,
} from "@remix-run/react"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { SearchResultEnum } from "./search/searchResultEnum"
import { CanadianismTypeEnum } from "~/types/CanadianismTypeEnum"
import { type ActionArgs, redirect, json } from "@remix-run/server-runtime"
import { z } from "zod"
import ActionButton from "~/components/elements/LinksAndButtons/ActionButton"
import RadioOrCheckbox from "~/components/bank/RadioOrCheckbox"
import FAIcon from "~/components/elements/Icons/FAIcon"
import Main from "~/components/elements/Main"
import Input from "~/components/bank/Input"
import { useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"

const searchActionSchema = z.object({
  searchTerm: z
    .string()
    .min(1, "Search term must be one or more characters (use * to search all)"),
  database: z.array(z.string()).min(1, "You must select at least one database"),
  canadianismType: z
    .array(z.string())
    .min(1, "You must select at least one Canadianism type"),
  caseSensitive: z.boolean().nullish(),
  attribute: z
    .array(z.string())
    .min(1, "You must select at least one data type"),
})

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()

  const submission = parse(formData, { schema: searchActionSchema })

  if (submission.intent !== "submit" || !submission.value) {
    return json(submission)
  }

  // TODO: Is there an easier way to directly translate these validated form
  // data params into URL search params? Seems unnecessarily bloated.
  const { searchTerm, database, caseSensitive, attribute, canadianismType } =
    submission.value

  const base = new URL(request.url)
  const url = new URL(`/search/${searchTerm}`, base)

  url.searchParams.set("caseSensitive", String(caseSensitive))
  url.searchParams.set("attribute", attribute[0])
  database.forEach((d) => url.searchParams.append("database", d))
  canadianismType.forEach((ct) =>
    url.searchParams.append("canadianismType", ct)
  )

  return redirect(url.toString())
}

const SEARCH_PATH = "/search"

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const params = useParams<{ searchTerm?: string }>()
  const currentAttribute = searchParams.get("attribute") ?? SearchResultEnum.ALL

  const lastSubmission = useActionData<typeof action>()

  const [form, fields] = useForm({
    lastSubmission,
    shouldValidate: "onInput", // Run the same validation logic on client
    onValidate({ formData }) {
      return parse(formData, { schema: searchActionSchema })
    },
  })

  return (
    <Main center>
      <PageHeader>Search entries</PageHeader>
      <Form
        {...form.props}
        className="flex flex-col gap-4 lg:flex-row lg:gap-8"
        method="post"
      >
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Search term"
              className="border border-gray-700 p-2 text-2xl"
              name="searchTerm"
              defaultValue={params.searchTerm}
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
                    defaultChecked: true,
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4">
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
              options={Object.values(CanadianismTypeEnum).map(
                (canadianismType) => ({
                  label: canadianismType,
                  value: canadianismType,
                  defaultChecked: true,
                })
              )}
            />
          </div>
        </div>
        <div className="text-center lg:text-start">
          <ActionButton
            size="large"
            name="attribute"
            value={currentAttribute}
            className="mx-auto w-fit"
            formActionPath={SEARCH_PATH}
          >
            <FAIcon iconName="fa-search" className="mr-2" /> Search
          </ActionButton>
        </div>
      </Form>
      <Outlet />
    </Main>
  )
}
