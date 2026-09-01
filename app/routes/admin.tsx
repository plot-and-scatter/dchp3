import { Outlet } from "react-router"
import { type LoaderFunctionArgs } from "react-router"
import Main from "~/components/elements/Layouts/Main"
import { redirectIfUserNotLoggedIn } from "~/services/auth/session.server"

// A layout, and only a layout. It used to render "Your access" -- the logged-in
// email, a log out button, and every role and permission the user holds --
// which every child route then inherited above its own content. That belongs
// to /admin itself, so it now lives in admin/index.tsx.
//
// The login check stays here, because it should apply to every admin route.
// Note that it guards loaders only: a child route with an action guards itself.

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await redirectIfUserNotLoggedIn(request)
  return null
}

export default function Admin() {
  return (
    <Main>
      <Outlet />
    </Main>
  )
}
