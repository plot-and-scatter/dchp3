import { Form, Outlet, useParams } from "@remix-run/react"
import { type ActionArgs, redirect } from "@remix-run/server-runtime"
import { useState } from "react"
import Header from "~/components/elements/Header"
import Main from "~/components/elements/Main"
import Nav from "~/components/elements/Nav"

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())

  const mainUrl = `/search/${data.searchText}`
  const checkboxParameter = data.caseSensitive
    ? "?caseSensitive=" + data.caseSensitive
    : ""

  const redirectUrl = mainUrl + checkboxParameter
  return redirect(redirectUrl)
}

export default function SearchPage() {
  const params = useParams()
  const [text, setText] = useState(params?.text)

  return (
    <div className="relative">
      <Header />
      <Nav />
      <Main>
        <div className="flex max-w-4xl flex-col">
          <h1 className="text-2xl font-bold">Search entries</h1>
          <p>Enter search text to find headwords containing that text.</p>
          <Form method="post">
            <div className="flex w-4/5 flex-col gap-3 p-1">
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

              <div className="ml-2 flex justify-around">
                <label>
                  Case-sensitive:
                  <input
                    className="ml-3"
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
          </Form>
          <Outlet />
        </div>
      </Main>
    </div>
  )
}
