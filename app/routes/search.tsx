import { Outlet, useNavigate, useParams } from "@remix-run/react"
import { useCallback, useState } from "react"
import Header from "~/components/elements/Header"
import Main from "~/components/elements/Main"
import Nav from "~/components/elements/Nav"

export default function SearchPage() {
  const params = useParams()
  const [text, setText] = useState(params?.text)
  const navigate = useNavigate()

  const formSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      // TODO: Is this the best way to do this?
      e.preventDefault()
      navigate(`/search/${text}`)
      return false
    },
    [navigate, text]
  )

  return (
    <div className="relative">
      <Header />
      <Nav />
      <Main>
        <div>
          <h1 className="text-2xl font-bold">Search entries</h1>
          <p>Enter search text to find headwords containing that text.</p>
          <div>
            <form onSubmit={formSubmit}>
              <input
                type="text"
                placeholder="Search text"
                className="border border-slate-700 p-2"
                value={text}
                onChange={(e) => {
                  setText(e.target.value)
                }}
              />
              <button className="ml-3 border border-slate-600 bg-slate-500 p-2 text-white hover:bg-slate-400">
                <i className="fas fa-search mr-2"></i>
                Search
              </button>
            </form>
          </div>
          <Outlet />
        </div>
      </Main>
    </div>
  )
}
