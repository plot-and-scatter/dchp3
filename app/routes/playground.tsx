import CitationSearch from "~/components/EntryEditor/CitationSearch"
import Main from "~/components/elements/Main"

export default function Playground() {
  return (
    <Main>
      <h1 className="mb-8 text-2xl font-bold">Playground</h1>
      <h2 className="mb-2 text-lg font-bold">Citation search</h2>
      <CitationSearch />
    </Main>
  )
}
