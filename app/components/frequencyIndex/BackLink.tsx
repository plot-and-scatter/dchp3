import FAIcon from "~/components/elements/Icons/FAIcon"
import { Link } from "~/components/elements/LinksAndButtons/Link"

// Sits directly under the page header on every Frequency Index page other
// than the index itself, so a student can get back without scrolling past
// the content (Natalia, 2026-09-30). A small button rather than a text
// link, so it is seen as navigation and not as the first line of the page
// (Frank, 2026-09-30).
export default function BackLink() {
  return (
    <p className="-mt-1 mb-5 md:-mt-3">
      <Link
        to="/frequency-index"
        asButton
        appearance="secondary"
        buttonVariant="outline"
        buttonSize="small"
      >
        <FAIcon iconName="fa-arrow-left" /> Back to the Frequency Index
      </Link>
    </p>
  )
}
