import { Form, Outlet, useParams, useSearchParams } from "@remix-run/react"
import { type ActionArgs, redirect } from "@remix-run/server-runtime"
import { useState } from "react"
import Header from "~/components/elements/Header"
import Main from "~/components/elements/Main"
import Nav from "~/components/elements/Nav"
import { SearchResultEnum } from "./search/searchResultEnum"
import Button from "~/components/elements/Button"

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
  const currentAttribute =
    searchParams.get("attribute") ?? SearchResultEnum.HEADWORD

  const buttonCss = "w-24 underline hover:bg-blue-200 m-0.5 self-start"

  return (
    <div className="relative">
      <Header />
      <Nav />
      <Main>
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-bold">Search entries</h1>
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
              <Button className={"ml-3 border border-slate-600 bg-slate-500 p-2 text-white hover:bg-slate-400"} >
                search
              </Button>

            </div>
            <div className="ml-5 flex flex-col">
              <button
                className={buttonCss}
                name="attribute"
                value={SearchResultEnum.HEADWORD}
              >
                Headword
              </button>
              <button className={buttonCss} name="attribute" value={SearchResultEnum.MEANING}>
                Meaning
              </button>
              <button className={buttonCss} name="attribute" value="other">
                other
              </button>
              <button className={buttonCss} name="attribute" value="other">
                other
              </button>
              <button className={buttonCss} name="attribute" value="other">
                other
              </button>
            </div>
          </Form>
          <Outlet />
        </div>
      </Main>
    </div>
  )
}
