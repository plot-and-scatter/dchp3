import { Outlet, useSearchParams } from "@remix-run/react"
import { PageHeader } from "~/components/elements/PageHeader"
import {
  SearchResultEnum,
  SearchResultEnumDisplay,
} from "./search/searchResultEnum"
import { CanadianismTypeEnum } from "~/types/CanadianismTypeEnum"
import { type ActionArgs, redirect } from "@remix-run/server-runtime"
import { ValidatedForm, validationError } from "remix-validated-form"
import { withZod } from "@remix-validated-form/with-zod"
import { z } from "zod"
import { zfd } from "zod-form-data"
import ActionButton from "~/components/elements/LinksAndButtons/ActionButton"
import BankInput from "~/components/bank/BankInput"
import BankRadioOrCheckbox from "~/components/bank/BankRadioOrCheckbox"
import FAIcon from "~/components/elements/Icons/FAIcon"
import Main from "~/components/elements/Main"

const searchActionSchema = z.object({
  searchTerm: z.string().min(1, "Search term must be one or more characters"),
  database: zfd.repeatable(
    z.array(z.string()).min(1, "You must select at least one database")
  ),
  caseSensitive: zfd.checkbox(),
  canadianismType: zfd.repeatable(
    z.array(z.string()).min(1, "You must select at least one Canadianism type")
  ),
})

const formValidator = withZod(searchActionSchema)

export async function action({ request }: ActionArgs) {
  const result = await formValidator.validate(await request.formData())

  if (result.error) {
    return validationError(result.error)
  }

  const { searchTerm, database } = result.data

  console.log("database", database)

  // const searchTerm = data.get("searchText") || ""
  // const caseSensitive = data.get("caseSensitive") ? "true" : "false"
  // const attribute = data.get("attribute") || ""
  // const dchpVersions = data.getAll("dchpVersion")

  const base = new URL(request.url)
  const url = new URL(`/search/${searchTerm}`, base)

  // url.searchParams.set("caseSensitive", caseSensitive)
  // url.searchParams.set("attribute", attribute.toString())
  // dchpVersions.forEach((v) =>
  //   url.searchParams.append("dchpVersion", v.toString())
  // )

  return redirect(url.toString())
}

const SEARCH_PATH = "/search"

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const currentAttribute = searchParams.get("attribute") ?? SearchResultEnum.ALL

  return (
    <Main center={true}>
      <PageHeader>Search entries</PageHeader>
      <p>Enter search text to find headwords containing that text.</p>
      <ValidatedForm
        validator={formValidator}
        className="flex flex-col p-4"
        method="post"
        action={SEARCH_PATH}
      >
        <div className="flex flex-col gap-3 p-1">
          <div>
            <BankInput
              type="text"
              placeholder="Search term"
              className="border border-slate-700 p-2"
              name="searchTerm"
            />
          </div>
          <div className="flex">
            <div className="mr-4">
              <strong>Case-sensitive</strong>
            </div>
            <BankRadioOrCheckbox
              type="checkbox"
              name="caseSensitive"
              optionSetClassName="flex gap-x-2 mr-4"
              options={[{ label: "", value: "on", defaultChecked: true }]}
            />
          </div>
          <div className="flex">
            <div className="mr-4">
              <strong>Database</strong>
            </div>
            <BankRadioOrCheckbox
              type="checkbox"
              name="database"
              optionSetClassName="flex gap-x-2 mr-4"
              options={[
                { label: "DCHP-1", value: "dchp1", defaultChecked: true },
                { label: "DCHP-2", value: "dchp2", defaultChecked: true },
                { label: "DCHP-3", value: "dchp3", defaultChecked: true },
              ]}
            />
          </div>
          <div className="flex">
            <div className="mr-4">
              <strong>Data type</strong>
            </div>
            <BankRadioOrCheckbox
              type="radio"
              name="attribute"
              className="flex"
              optionSetClassName="flex gap-x-2 mr-4"
              defaultValue={currentAttribute}
              options={Object.values(SearchResultEnum).map(
                (searchResultType) => ({
                  label: SearchResultEnumDisplay[searchResultType],
                  value: searchResultType,
                })
              )}
            />
          </div>
          <div className="flex">
            <div className="mr-4">
              <strong>Canadianism type</strong>
            </div>
            <BankRadioOrCheckbox
              type="checkbox"
              name="canadianismType"
              optionSetClassName="flex gap-x-2 mr-4"
              options={Object.values(CanadianismTypeEnum).map(
                (canadianismType) => ({
                  label: canadianismType,
                  value: canadianismType,
                  defaultChecked: true,
                })
              )}
            />
          </div>
          <ActionButton
            size="large"
            name="attribute"
            value={currentAttribute}
            className="mx-auto w-fit"
            formActionPath={SEARCH_PATH}
          >
            <FAIcon iconName="fa-search" className="mr-2" /> Search entries
          </ActionButton>
        </div>
      </ValidatedForm>
      <Outlet />
    </Main>
  )
}
