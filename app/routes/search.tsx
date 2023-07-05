import { Form, Outlet, useParams } from "@remix-run/react"
import { type ActionArgs, redirect } from "@remix-run/server-runtime"
import { useState } from "react"
import Header from "~/components/elements/Header"
import Main from "~/components/elements/Main"
import Nav from "~/components/elements/Nav"

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())

  const base = new URL(request.url)
  const url = new URL(`/search/${data.searchText}`, base)

  const caseSensitive = data.caseSensitive ? "true" : "false"
  const attribute = data.attribute ? data.attribute : "headword"

  url.searchParams.set("caseSensitive", caseSensitive)
  url.searchParams.set("attribute", attribute.toString())

  return redirect(url.toString())
}

export default function SearchPage() {
  const params = useParams()
  const [text, setText] = useState(params?.text)

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

              <button className="ml-3 border border-slate-600 bg-slate-500 p-2 text-white hover:bg-slate-400">
                <i className="fas fa-search mr-2"></i>
                Search
              </button>
            </div>
            <div className="ml-5 flex flex-col [&>*]:m-1 [&>*]:self-start">
              <button name="attribute" value="headword">
                Headword
              </button>
              <button name="attribute" value="meaning">
                Meaning
              </button>
              <button name="attribute" value="other">
                hi
              </button>
              <button name="attribute" value="other">
                hi
              </button>
              <button name="attribute" value="other">
                hi
              </button>
            </div>
          </Form>
          <Outlet />
        </div>
      </Main>
    </div>
  )
}
