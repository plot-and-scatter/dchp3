import { useMatches } from "@remix-run/react"
import { useMemo } from "react"
import { type EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { isNonPositive } from "./numberUtils"

const DEFAULT_REDIRECT = "/"

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect
  }

  return to
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches()
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  )
  return route?.data
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@")
}

export function stripHtml(text: string) {
  return text.replace(/<\/?[^>]+(>|$)/g, "")
}

export function getCheckboxValueAsBoolean(value: FormDataEntryValue) {
  const result = getStringFromFormInput(value)
  return result === "on"
}

export function getStringFromFormInput(formInput: FormDataEntryValue): string {
  return formInput?.toString() || ""
}

export function getStringOrNullFromFormInput(
  formInput: FormDataEntryValue
): string | null {
  return formInput?.toString() || null
}

export function getNumberFromFormInput(formInput: FormDataEntryValue) {
  const stringValue = formInput.toString()
  return parseInt(stringValue)
}

export function getBooleanFromFormInput(formInput: FormDataEntryValue) {
  const stringValue = formInput.toString()
  if (stringValue.toLowerCase().trim() === "true") return true
  if (stringValue.toLowerCase().trim() === "false") return false
  return Boolean(stringValue)
}

export function getEntryEditorFormAction(formInput: FormDataEntryValue) {
  const stringValue = formInput.toString()
  const enumValue = stringValue as EntryEditorFormActionEnum
  return enumValue
}

export function parsePageNumberOrError(page: string | undefined): number {
  if (page === undefined) throw new Error(`Page is undefined`)

  const pageNumber = parseInt(page)
  if (isNaN(pageNumber)) {
    throw new Error(`Page Number ("${page}") must be a number`)
  } else if (isNonPositive(pageNumber)) {
    throw new Error(`Page Number ("${page}") must be greater than zero`)
  }

  return pageNumber
}

export function calculateSkip(
  page: string | null | undefined,
  skipPerPage: number
) {
  let skip = 0
  if (page === null || page === undefined) return skip

  const pageNumber = parsePageNumberOrError(page)

  return (pageNumber - 1) * skipPerPage
}
