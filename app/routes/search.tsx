import { Form, Outlet, useParams, useSearchParams } from "@remix-run/react"
import { PageHeader } from "~/components/elements/PageHeader"
import {
  SearchResultEnum,
  SearchResultEnumDisplay,
} from "./search/searchResultEnum"
import { type ActionArgs, redirect } from "@remix-run/server-runtime"
import { useState } from "react"
import Button from "~/components/elements/LinksAndButtons/Button"
import Main from "~/components/elements/Main"
import BankRadioOrCheckbox from "~/components/bank/BankRadioOrCheckbox"

export async function action({ request }: ActionArgs) {
  // console.log("data", await request.formData())

  const data = Object.fromEntries(await request.formData())

  console.log("data", data)

  const base = new URL(request.url)
  const url = new URL(`/search/${data.searchText}`, base)

  const caseSensitive = data.caseSensitive ? "true" : "false"
  const attribute = data.attribute ? data.attribute : SearchResultEnum.HEADWORD

  url.searchParams.set("caseSensitive", caseSensitive)
  url.searchParams.set("attribute", attribute.toString())

  return redirect(url.toString())
}

export default function SearchPage() {
  const params = useParams()
  const [text, setText] = useState(params?.text)

  const [searchParams] = useSearchParams()
  const currentAttribute = searchParams.get("attribute") ?? SearchResultEnum.ALL

  return (
    <Main center={true}>
      <PageHeader>Search entries</PageHeader>
      <p>Enter search text to find headwords containing that text.</p>
      <Form className="flex flex-col p-4" method="post">
        <div className="flex flex-col gap-3 p-1">
          <input
            type="text"
            placeholder="Search text"
            className="border border-slate-700 p-2"
            name="searchText"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
            }}
          />
          <div>
            <label>
              <strong>Case-sensitive</strong>
              <input
                className="ml-3 max-w-sm"
                name="caseSensitive"
                type="checkbox"
                value="true"
                defaultChecked
              />
            </label>
          </div>
          <div className="flex">
            <div className="mr-4">
              <strong>DCHP version</strong>
            </div>
            <BankRadioOrCheckbox
              type="checkbox"
              name="dchpVersion"
              className="flex"
              optionSetClassName="flex gap-x-2 mr-4"
              options={[
                { name: "DCHP-1", value: "dchp1", defaultChecked: true },
                { name: "DCHP-2", value: "dchp2", defaultChecked: true },
                { name: "DCHP-3", value: "dchp3", defaultChecked: true },
              ]}
            />
          </div>
          <div className="flex">
            <div className="mr-4">
              <strong>Part of speech</strong>
            </div>
            <BankRadioOrCheckbox
              type="radio"
              name="attribute"
              className="flex"
              optionSetClassName="flex gap-x-2 mr-4"
              defaultValue={currentAttribute}
              options={Object.values(SearchResultEnum).map(
                (searchResultType) => ({
                  name: SearchResultEnumDisplay[searchResultType],
                  value: searchResultType,
                })
              )}
            />
          </div>
          <Button size="large" name="attribute" value={currentAttribute}>
            Search entries
          </Button>
        </div>
      </Form>
      <Outlet />
    </Main>
  )
}
