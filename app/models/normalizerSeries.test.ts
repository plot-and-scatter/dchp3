import {
  changeSinceFirst,
  describePoint,
  formatChange,
  scaleSeries,
  seriesStats,
  shortDate,
  timeRangeOf,
} from "./normalizerSeries"

const point = (id: number, observed: string, hits: number) => ({
  id,
  observed,
  hits,
  source: "lookup",
  lookup: { id: 10, term: "toque" },
})

const series = [
  point(1, "2026-07-19", 100),
  point(2, "2026-08-01", 300),
  point(3, "2026-09-22", 200),
]

describe("seriesStats", () => {
  it("gives min, mean and max", () => {
    expect(seriesStats(series)).toEqual({ min: 100, mean: 200, max: 300 })
  })
  it("is null for no points", () => {
    expect(seriesStats([])).toBeNull()
  })
})

describe("changeSinceFirst", () => {
  it("is the change from the first to the last point", () => {
    expect(changeSinceFirst(series)).toBeCloseTo(100)
    expect(formatChange(100)).toBe("+100.0%")
    expect(formatChange(-28.14)).toBe("-28.1%")
  })
  it("is null with fewer than two points", () => {
    expect(changeSinceFirst([series[0]])).toBeNull()
    expect(changeSinceFirst([])).toBeNull()
  })
})

describe("timeRangeOf", () => {
  it("spans every domain's points", () => {
    const range = timeRangeOf({ ca: series.slice(0, 2), uk: series.slice(2) })
    expect(range).toEqual({
      min: Date.parse("2026-07-19"),
      max: Date.parse("2026-09-22"),
    })
  })
  it("is null when nothing is observed", () => {
    expect(timeRangeOf({ ca: [] })).toBeNull()
    expect(timeRangeOf(undefined)).toBeNull()
  })
})

describe("scaleSeries", () => {
  const range = timeRangeOf({ ca: series })!
  const { x, y } = scaleSeries(series, range, {
    width: 100,
    height: 50,
    pad: 5,
  })

  it("puts the first and last dates at the padded edges", () => {
    expect(x("2026-07-19")).toBe(5)
    expect(x("2026-09-22")).toBe(95)
  })
  it("keeps the extremes inside the drawing with room above and below", () => {
    expect(y(300)).toBeGreaterThan(5)
    expect(y(100)).toBeLessThan(45)
    expect(y(300)).toBeLessThan(y(100))
  })
  it("draws a flat series mid-height", () => {
    const flat = [point(1, "2026-07-19", 500), point(2, "2026-07-20", 500)]
    const s = scaleSeries(flat, timeRangeOf({ ca: flat })!, {
      width: 100,
      height: 50,
      pad: 5,
    })
    expect(s.y(500)).toBeCloseTo(25)
  })
})

describe("labels", () => {
  it("formats the calendar day in UTC", () => {
    expect(shortDate("2026-07-19")).toBe("Jul 19")
  })
  it("describes a point with its origin", () => {
    expect(describePoint(series[0])).toBe("100 on 2026-07-19, for “toque”")
    expect(
      describePoint({ ...series[0], lookup: null, source: "spreadsheet" })
    ).toBe("100 on 2026-07-19, from spreadsheet")
  })
})
