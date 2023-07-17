import { Form } from "@remix-run/react"

export default function LoginButton() {
  return (
    <Form action={"/auth/auth"} method={"post"}>
      <button>Log in with Auth0</button>
    </Form>
  )
}
