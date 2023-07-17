import { Form } from "@remix-run/react"

export default function LoginButton() {
  return (
    <Form action={"/auth/authy"} method={"post"}>
      <button
        className={""}
        // disabled={isSubmitting}
      >
        Log in with Auth0
      </button>
    </Form>
  )
}
