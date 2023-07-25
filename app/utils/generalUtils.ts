import { useMatches } from "@remix-run/react"
import { useMemo } from "react"
import { type attributeEnum } from "~/components/editing/attributeEnum"
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

export function parseBooleanOrError(text: string) {
  if (text === "true") {
    return true
  } else if (text === "false") {
    return false
  }

  throw new Error(`text "${text}" cannot be parsed into boolean value`)
}

export function stripHtml(text: string) {
  return text.replace(/<\/?[^>]+(>|$)/g, "")
}

export function getStringFromFormInput(formInput: FormDataEntryValue): string {
  return formInput.toString()
}

export function getNumberFromFormInput(formInput: FormDataEntryValue) {
  const stringValue = formInput.toString()
  return parseInt(stringValue)
}

export function getAttributeEnumFromFormInput(formInput: FormDataEntryValue) {
  const stringValue = formInput.toString()
  const enumValue = stringValue as attributeEnum
  return enumValue
}

export function parsePageNumberOrError(page: string): number {
  const pageNumber = parseInt(page)
  if (isNaN(pageNumber)) {
    throw new Error(`Page Number ("${page}") must be a number`)
  } else if (isNonPositive(pageNumber)) {
    throw new Error(`Page Number ("${page}") must be greater than zero`)
  }

  return pageNumber
}
