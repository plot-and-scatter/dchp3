import FAIcon from "~/components/elements/Icons/FAIcon"
import { Link } from "~/components/elements/LinksAndButtons/Link"

// Sits directly under the page header on every Frequency Index page other
// than the index itself, so a student can get back without scrolling past
// the content (Natalia, 2026-09-30).
export default function BackLink() {
  return (
    <p className="-mt-1 mb-4 md:-mt-3">
      <Link to="/frequency-index">
        <FAIcon iconName="fa-arrow-left" /> Back to the Frequency Index
      </Link>
    </p>
  )
}
