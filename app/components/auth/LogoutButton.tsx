import { Form } from "@remix-run/react"

export default function LogoutButton() {
  return (
    <Form action={"/auth/logout"} method={"post"}>
      <button>Log out</button>
    </Form>
  )
}
