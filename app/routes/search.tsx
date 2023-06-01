import { Form, Outlet, useNavigate, useParams } from "@remix-run/react"
import { ActionArgs, redirect } from "@remix-run/server-runtime"
import { useCallback, useState } from "react"
import Header from "~/components/elements/Header"
import Main from "~/components/elements/Main"
import Nav from "~/components/elements/Nav"

export async function action({ params }: ActionArgs) {
  return redirect(`/search/b`)
}


export default function SearchPage() {
  const params = useParams()
  const [text, setText] = useState(params?.text)

  return (
    <div className="relative">
      <Header />
      <Nav />
      <Main>
        <div>
          <h1 className="text-2xl font-bold">Search entries</h1>
          <p>Enter search text to find headwords containing that text.</p>
          <Form method="post">
            <div className="flex flex-col gap-3 p-1">
              <input
                type="text"
                placeholder="Search text"
                className="border border-slate-700 p-2"
                value={text}
                onChange={(e) => {
                  setText(e.target.value)
                }}
              />

              <div className="flex ml-2 justify-around">
                <label>
                  Case-sensitive:
                  <input className="ml-3" type="checkbox" />
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

      </Main >
    </div >
  )
}
