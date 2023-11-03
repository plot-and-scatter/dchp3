import clsx from "clsx"
import { Link } from "../elements/LinksAndButtons/Link"

type PaginationControlProps = {
  baseLink: string
  currentPage: number
  pageCount: number
}

export default function PaginationControl({
  baseLink,
  currentPage,
  pageCount,
}: PaginationControlProps) {
  const showPrevious = currentPage > 1
  const showNext = currentPage < pageCount

  let middlePageLinks = []

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
    middlePageLinks.push(
      <Link
        key={`page-link-${pageNumber}`}
        to={`${baseLink}/${pageNumber}`}
        className={clsx(
          "block px-2 py-1",
          pageNumber === currentPage && " bg-red-700 font-bold text-white"
        )}
      >
        {pageNumber}
      </Link>
    )
  }

  if (middlePageLinks.length > 7) {
    let leftSlice = Math.max(currentPage - 4, 0)
    let rightSlice = Math.min(currentPage + 3, middlePageLinks.length)

    // If there are fewer than 7 items total, then expand the right slice
    if (leftSlice + rightSlice < 7) {
      rightSlice = 7 - leftSlice
    }

    // If there are fewer than 7 items to the left (and less than 7 items total)
    // expand the leftSlice as required
    if (rightSlice - leftSlice > 0) {
      leftSlice = Math.max(0, rightSlice - 7)
    }

    // Now do the slicing
    middlePageLinks = [...middlePageLinks].slice(leftSlice, rightSlice)

    // Add the indicators for more pages, if required
    if (leftSlice > 0) {
      middlePageLinks = [
        <div key="page-link-elided-left">...</div>,
        ...middlePageLinks,
      ]
    }

    if (rightSlice < pageCount) {
      middlePageLinks.push(<div key="page-link-elided-right">...</div>)
    }
  }

  return (
    <div className="flex items-center justify-between gap-x-8">
      <Link
        buttonVariant="outline"
        asButton
        to={`${baseLink}/${currentPage - 1}`}
        className={showPrevious ? "visible" : "invisible"}
      >
        &larr; Previous page
      </Link>
      <div className="flex grow flex-row justify-center text-center">
        {middlePageLinks}
      </div>
      <Link
        buttonVariant="outline"
        asButton
        to={`${baseLink}/${currentPage + 1}`}
        className={showNext ? "visible" : "invisible"}
      >
        Next page &rarr;
      </Link>
    </div>
  )
}
