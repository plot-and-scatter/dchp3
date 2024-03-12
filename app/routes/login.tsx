import LoginButton from "~/components/auth/LoginButton"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import TextPageMain from "~/components/elements/Layouts/TextPageMain"

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
    <TextPageMain>
      <PageHeader>Admin log in</PageHeader>
      <p>
        If you have admin access to the DCHP-3, please use the login button
        below.
      </p>
      <div className="my-10">
        <LoginButton />
      </div>
    </TextPageMain>
  )
}
