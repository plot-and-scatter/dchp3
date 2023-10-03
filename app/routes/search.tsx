import { Form, Outlet, useParams, useSearchParams } from "@remix-run/react"
import { PageHeader } from "~/components/elements/PageHeader"
import { SearchResultEnum } from "./search/searchResultEnum"
import { type ActionArgs, redirect } from "@remix-run/server-runtime"
import { useState } from "react"
import Button from "~/components/elements/LinksAndButtons/Button"
import Main from "~/components/elements/Main"

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())

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
      <Form className="flex flex-row p-4" method="post">
        <div className="flex flex-col gap-3 p-1">
          <input
            type="text"
            placeholder="Search text"
            className="w-96 border border-slate-700 p-2"
            name="searchText"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
            }}
          />
          <div>
            <label>
              Case-sensitive:
              <input
                className="ml-3 max-w-sm"
                name="caseSensitive"
                type="checkbox"
                value="true"
              />
            </label>
          </div>
          <Button size="large" name="attribute" value={currentAttribute}>
            search
          </Button>
        </div>

        <div className="ml-5 flex flex-col items-start">
          {Object.values(SearchResultEnum).map((searchResultType) => {
            const textClassname =
              currentAttribute === searchResultType ? "font-black" : ""

            return (
              <Button
                asLink
                name="attribute"
                value={searchResultType}
                className=" w-full text-left"
                key={`attribute-${searchResultType}`}
              >
                <span className={textClassname}>{searchResultType}</span>
              </Button>
            )
          })}
        </div>
      </Form>
      <Outlet />
    </Main>
  )
}
