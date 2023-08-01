import { Form } from "@remix-run/react"

export default function LogoutButton() {
  return (
    <Form action={"/auth/logout"} method={"post"}>
      <button
        className="rounded border border-blue-500 px-4 py-2 text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
        // disabled={isSubmitting}
      >
        Log out
      </button>
    </Form>
  )
}
