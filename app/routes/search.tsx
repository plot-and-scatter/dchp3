import { Outlet, useParams, useSearchParams } from "@remix-run/react"
import { PageHeader } from "~/components/elements/PageHeader"
import { SearchResultEnum } from "./search/searchResultEnum"
import { CanadianismTypeEnum } from "~/types/CanadianismTypeEnum"
import { type ActionArgs, redirect } from "@remix-run/server-runtime"
import { ValidatedForm, validationError } from "remix-validated-form"
import { withZod } from "@remix-validated-form/with-zod"
import { z } from "zod"
import ActionButton from "~/components/elements/LinksAndButtons/ActionButton"
import BankRadioOrCheckbox from "~/components/bank/BankRadioOrCheckbox"
import FAIcon from "~/components/elements/Icons/FAIcon"
import Main from "~/components/elements/Main"
import BankInput from "~/components/bank/BankInput"
import { zfd } from "zod-form-data"

const searchActionSchema = z.object({
  searchTerm: z.string().min(1, "Search term must be one or more characters"),
  database: zfd.repeatable(
    z.array(z.string()).min(1, "You must select at least one database")
  ),
  canadianismType: zfd.repeatable(
    z.array(z.string()).min(1, "You must select at least one Canadianism type")
  ),
  caseSensitive: zfd.checkbox(),
  attribute: zfd.repeatable(
    z.array(z.string()).min(1, "You must select at least one data type")
  ),
})

const formValidator = withZod(searchActionSchema)

export async function action({ request }: ActionArgs) {
  const result = await formValidator.validate(await request.formData())

  if (result.error) {
    return validationError(result.error)
  }

  // TODO: Is there an easier way to directly translate these validated form
  // data params into URL search params? Seems unnecessarily bloated.
  const { searchTerm, database, caseSensitive, attribute, canadianismType } =
    result.data

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

  return (
    <Main center>
      <PageHeader>Search entries</PageHeader>
      <ValidatedForm
        validator={formValidator}
        className="flex flex-row gap-8"
        method="post"
        action={SEARCH_PATH}
      >
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-2">
            <BankInput
              type="text"
              placeholder="Search term"
              className="border border-slate-700 p-2 text-2xl"
              name="searchTerm"
              defaultValue={params.searchTerm}
            />
            <div className="whitespace-nowrap">
              <BankRadioOrCheckbox
                type="checkbox"
                name="caseSensitive"
                optionSetClassName="flex gap-x-2 mr-4"
                options={[
                  {
                    label: "Case sensitive",
                    value: "on",
                    defaultChecked: true,
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="mr-4">
            <strong>Database</strong>
          </div>
          <BankRadioOrCheckbox
            type="checkbox"
            name="database"
            optionSetClassName="flex gap-x-2 mr-4"
            direction="vertical"
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
          <BankRadioOrCheckbox
            type="checkbox"
            name="canadianismType"
            optionSetClassName="flex gap-x-2 mr-4"
            direction="vertical"
            options={Object.values(CanadianismTypeEnum).map(
              (canadianismType) => ({
                label: canadianismType,
                value: canadianismType,
                defaultChecked: true,
              })
            )}
          />
        </div>
        <div>
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
      </ValidatedForm>
      <Outlet />
    </Main>
  )
}
