import { Form } from "@remix-run/react"
import Button from "../elements/LinksAndButtons/Button"

export default function LogoutButton() {
  return (
    <Form action={"/auth/logout"} method={"post"}>
      <Button appearance="action" variant="outline">
        Log out
      </Button>
    </Form>
  )
}
