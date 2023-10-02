import { Form } from "@remix-run/react"
import Button from "../elements/LinksAndButtons/Button"

export default function LoginButton() {
  return (
    <Form action={"/auth/auth"} method={"post"}>
      <Button appearance="action" variant="outline">
        Log in with Auth0
      </Button>
    </Form>
  )
}
