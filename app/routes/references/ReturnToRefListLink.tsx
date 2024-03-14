import BackIcon from "~/components/elements/Icons/BackIcon"
import { Link } from "~/components/elements/LinksAndButtons/Link"

export default function ReturnToRefListLink() {
  return (
    <div className="mb-8">
      <Link to={`/references`} className="w-fit" appearance="secondary">
        <BackIcon /> Return to reference list
      </Link>
    </div>
  )
}
