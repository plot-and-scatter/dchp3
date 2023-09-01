import { NotANumberError, isInteger, isNumber, toNumber } from "./numbers"

test("isNumber should correctly accept numbers", () => {
  expect(isNumber(-1)).toBe(true)
  expect(isNumber(0)).toBe(true)
  expect(isNumber(1)).toBe(true)
  expect(isNumber("-1")).toBe(true)
  expect(isNumber("0")).toBe(true)
  expect(isNumber("1")).toBe(true)
  expect(isNumber(-1.1)).toBe(true)
  expect(isNumber(0.123)).toBe(true)
  expect(isNumber(1.1)).toBe(true)
  expect(isNumber("-1.1")).toBe(true)
  expect(isNumber(1e4)).toBe(true)
  expect(isNumber(0xabc)).toBe(true)
  expect(isNumber("1e4")).toBe(true)
  expect(isNumber("0xabc")).toBe(true)
})

test("isNumber should correctly reject non-numbers", () => {
  expect(isNumber("foo")).toBe(false)
  expect(isNumber(NaN)).toBe(false)
})

test("isInteger should correctly accept integers", () => {
  expect(isInteger(-1)).toBe(true)
  expect(isInteger(0)).toBe(true)
  expect(isInteger(1)).toBe(true)
  expect(isInteger("-1")).toBe(true)
  expect(isInteger("0")).toBe(true)
  expect(isInteger("1")).toBe(true)
})

test("isInteger should correctly reject non-integers", () => {
  expect(isInteger(-1.1)).toBe(false)
  expect(isInteger(0.123)).toBe(false)
  expect(isInteger(1.1)).toBe(false)
  expect(isInteger("-1.1")).toBe(false)
  expect(isInteger("foo")).toBe(false)
})

test("toNumber should not throw on a number", () => {
  expect(() => toNumber("123")).not.toThrowError(NotANumberError)
})

test("toNumber should correctly throw on a non-number", () => {
  expect(() => toNumber("foo")).toThrowError(NotANumberError)
})
