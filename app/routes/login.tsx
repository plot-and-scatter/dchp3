import { Form } from "@remix-run/react"
import LoginButton from "~/components/auth/LoginButton"

export default function Login() {
  // TODO: Upgrade Remix and restore useNavigation() step
  // const isSubmitting = navigation.state === "submitting"

  // const content = isSubmitting
  //   ? submittingElement || (
  //       <>
  //         <LoadingSpinner>Loading...</LoadingSpinner>
  //       </>
  //     )
  //   : children

  return (
    <div className="mx-auto my-10 text-center">
      <LoginButton />
    </div>
  )
}
