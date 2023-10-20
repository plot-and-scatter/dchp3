import LoginButton from "~/components/auth/LoginButton"
import { PageHeader } from "~/components/elements/PageHeader"
import TextPageMain from "~/components/elements/TextPageMain"

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
      <div className="my-10">
        <LoginButton />
      </div>
    </TextPageMain>
  )
}
