import { useEffect, useRef } from "react"
import Button from "../elements/Button"

const ConfirmationInput = () => {
  const inputElement = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputElement?.current?.focus()
  }, [])

  return (
    <div className="flex flex-row items-center">
      <p> Are you sure you want to proceed? </p>
      <Button size="small" appearance="danger" type="submit">
        Confirm
      </Button>
    </div>
  )
}

export default ConfirmationInput
