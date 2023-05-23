import { Link } from "@remix-run/react"
import Header from "~/components/elements/Header"
import Main from "~/components/elements/Main"
import Nav from "~/components/elements/Nav"
import QuickLinks from "~/components/quicklinks/QuickLinks"
import Canuck from "~/samples/Canuck"

// import { useOptionalUser } from "~/utils";

export default function Index() {
  // const user = useOptionalUser();

  return (
    <div className="relative">
      <Header />
      <Nav />
      <Main>
        <p>To come.</p>
      </Main>
    </div>
  )
}
