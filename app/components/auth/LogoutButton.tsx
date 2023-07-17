import { Form } from "@remix-run/react"

export default function LogoutButton() {
  return (
    <Form action={"/auth/logout"} method={"post"}>
      <button
        className={""}
        // disabled={isSubmitting}
      >
        Log out
      </button>
    </Form>
  )
}
