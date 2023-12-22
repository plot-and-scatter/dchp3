import clsx from "clsx"
import { Link } from "../elements/LinksAndButtons/Link"
import FAIcon from "../elements/Icons/FAIcon"

const buildUrl = (
  baseLink: string,
  pageNumber: number,
  useSearch?: string,
  url?: string
) => {
  if (!useSearch) {
    return `${baseLink}/${pageNumber}`
  } else {
    if (!url)
      throw new Error(
        `Can't use PaginationControl in useSearch mode without supplying url`
      )
    const _url = new URL(url)
    _url.searchParams.set(useSearch, String(pageNumber))

    console.log(_url, String(_url))

    return String(_url)
  }
}

type PaginationControlProps = {
  baseLink: string
  currentPage: number
  pageCount: number
  useSearch?: string
  url?: string
}

export default function PaginationControl({
  baseLink,
  currentPage,
  pageCount,
  useSearch,
  url,
}: PaginationControlProps) {
  const showPrevious = currentPage > 1
  const showNext = currentPage < pageCount

  let middlePageLinks = []

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
    middlePageLinks.push(
      <Link
        key={`page-link-${pageNumber}`}
        to={buildUrl(baseLink, pageNumber, useSearch, url)}
        className={clsx(
          "block px-1 py-1 md:px-2",
          pageNumber === currentPage && " bg-primary-dark font-bold text-white"
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
    <div className="flex w-full items-center justify-between gap-x-8">
      <Link
        buttonVariant="outline"
        asButton
        to={buildUrl(baseLink, currentPage - 1, useSearch, url)}
        className={showPrevious ? "visible" : "invisible"}
      >
        <FAIcon iconName="fa-arrow-left" />
        &nbsp;Prev<span className="hidden md:inline">ious page</span>
      </Link>
      <div className="flex grow flex-row justify-center text-center">
        {middlePageLinks}
      </div>
      <Link
        buttonVariant="outline"
        asButton
        to={buildUrl(baseLink, currentPage + 1, useSearch, url)}
        className={showNext ? "visible" : "invisible"}
      >
        Next<span className="hidden md:inline"> page</span>&nbsp;
        <FAIcon iconName="fa-arrow-right" />
      </Link>
    </div>
  )
}
