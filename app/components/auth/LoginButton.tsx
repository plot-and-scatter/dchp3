import { Form } from "@remix-run/react"

export default function LoginButton() {
  return (
    <Form action={"/auth/auth"} method={"post"}>
      <button className="rounded border border-blue-500 px-4 py-2 text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600">
        Log in with Auth0
      </button>
    </Form>
  )
}
