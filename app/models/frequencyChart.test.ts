import { describe, expect, it } from "vitest"
import {
  CHART_HEIGHT_PT,
  CHART_WIDTH_PT,
  chartCaption,
  chartDomainLabel,
  chartFileName,
  chartTitle,
  dataLabel,
  formatTick,
  layoutChart,
  longDate,
  niceAxis,
  sortBars,
  yAxisLabel,
} from "./frequencyChart"

describe("niceAxis", () => {
  it("rounds up to a 1, 2, 2.5 or 5 step with about five gridlines", () => {
    expect(niceAxis(80.9)).toEqual({
      max: 100,
      step: 20,
      ticks: [0, 20, 40, 60, 80, 100],
    })
    // 1234 x 1.08 = 1333, a fifth of which is 267, so the step is 500.
    expect(niceAxis(1234)).toEqual({
      max: 1500,
      step: 500,
      ticks: [0, 500, 1000, 1500],
    })
  })

  it("leaves headroom above the tallest column for its label", () => {
    // 100 x 1.08 = 108 needs a line above 100; the step is 25, so 125.
    expect(niceAxis(100)).toEqual({
      max: 125,
      step: 25,
      ticks: [0, 25, 50, 75, 100, 125],
    })
  })

  it("handles fractions without float noise", () => {
    expect(niceAxis(0.37)).toEqual({
      max: 0.4,
      step: 0.1,
      ticks: [0, 0.1, 0.2, 0.3, 0.4],
    })
  })

  it("draws a zero-to-one axis when every column is zero", () => {
    expect(niceAxis(0).max).toBe(1)
  })
})

describe("text", () => {
  it("formats ticks to the step's precision", () => {
    expect(formatTick(20, 20)).toBe("20")
    expect(formatTick(0.3, 0.1)).toBe("0.3")
    expect(formatTick(2.5, 2.5)).toBe("2.5")
  })

  it("labels every column with one decimal place", () => {
    expect(dataLabel(80.94)).toBe("80.9")
    expect(dataLabel(3)).toBe("3.0")
  })

  it("names the multiplier in the y-axis label", () => {
    expect(yAxisLabel(10_000)).toBe("Frequency index (x10,000)")
    expect(yAxisLabel(1_000_000)).toBe("Frequency index (x1,000,000)")
  })

  it("spells the month out in the caption", () => {
    expect(longDate("2024-10-21T18:00:00.000Z")).toMatch(
      /^21 October 2024$|^22 October 2024$/
    )
    expect(chartCaption("2024-10-21T18:00:00.000Z")).toMatch(
      /^Internet Domain Search, 2[12] October 2024$/
    )
  })

  it("labels columns by domain, with the US group as US", () => {
    expect(
      ["ca", "us", "uk", "ie", "nz", "au", "za"].map(chartDomainLabel)
    ).toEqual([".ca", "US", ".uk", ".ie", ".nz", ".au", ".za"])
    expect(chartDomainLabel("xx")).toBe("xx")
  })

  it("puts exclusions in the title as NOT", () => {
    expect(chartTitle("toque")).toBe("toque")
    expect(chartTitle("toque", null)).toBe("toque")
    expect(chartTitle("toque", "-monkey")).toBe("toque NOT monkey")
    expect(chartTitle("toque", "monkey site:example.com")).toBe(
      "toque NOT monkey NOT site:example.com"
    )
  })

  it("builds a safe file name from the term and date", () => {
    expect(chartFileName("Toque AND hockey", "2026-09-30T20:00:00.000Z")).toBe(
      "frequency-index-toque-and-hockey-2026-09-30.png"
    )
    expect(chartFileName("???", "2026-09-30T20:00:00.000Z")).toBe(
      "frequency-index-term-2026-09-30.png"
    )
  })
})

const bars = [
  { key: "za", label: "South Africa", value: 2.5 },
  { key: "ca", label: "Canada", value: 80.9 },
  { key: "us", label: "USA", value: 12.34 },
]

describe("layoutChart", () => {
  it("orders columns as the published DCHP-2 charts do, US last", () => {
    expect(sortBars(bars).map((b) => b.key)).toEqual(["ca", "za", "us"])
    expect(
      layoutChart(bars, { title: "toque", multiplier: 10_000 }).bars.map(
        (b) => b.key
      )
    ).toEqual(["ca", "za", "us"])
    const all = ["us", "za", "au", "nz", "ie", "uk", "ca"].map((key) => ({
      key,
      label: key,
      value: 1,
    }))
    expect(sortBars(all).map((b) => b.key)).toEqual([
      "ca",
      "uk",
      "ie",
      "nz",
      "au",
      "za",
      "us",
    ])
  })

  it("is 9 x 14 cm in points", () => {
    const l = layoutChart(bars, { title: "toque", multiplier: 10_000 })
    expect(l.width).toBeCloseTo(396.85, 1)
    expect(l.height).toBeCloseTo(255.12, 1)
    expect(CHART_WIDTH_PT / CHART_HEIGHT_PT).toBeCloseTo(14 / 9, 5)
  })

  it("keeps every column and label inside the plot", () => {
    const l = layoutChart(bars, { title: "toque", multiplier: 10_000 })
    const bottom = l.plot.y + l.plot.h
    for (const b of l.bars) {
      expect(b.x).toBeGreaterThanOrEqual(l.plot.x)
      expect(b.x + b.w).toBeLessThanOrEqual(l.plot.x + l.plot.w + 1e-9)
      expect(b.y).toBeGreaterThanOrEqual(l.plot.y)
      expect(b.y + b.h).toBeCloseTo(bottom, 6)
      expect(b.valueY).toBeLessThan(b.y)
      expect(b.labelY).toBeGreaterThan(bottom)
    }
    const tallest = l.bars.find((b) => b.key === "ca")!
    expect(tallest.valueLabel).toBe("80.9")
    expect(tallest.h).toBeCloseTo((80.9 / 100) * l.plot.h, 6)
  })

  it("puts the zero line at the bottom and the axis max at the top", () => {
    const l = layoutChart(bars, { title: "toque", multiplier: 10_000 })
    expect(l.ticks[0]).toMatchObject({ value: 0, label: "0" })
    expect(l.ticks[0].y).toBeCloseTo(l.plot.y + l.plot.h, 6)
    expect(l.ticks[l.ticks.length - 1].y).toBeCloseTo(l.plot.y, 6)
  })

  it("shrinks a long title rather than letting it run off the image", () => {
    const short = layoutChart(bars, { title: "toque", multiplier: 10_000 })
    const long = layoutChart(bars, {
      title: "a very long headword that goes on and on and on and on",
      multiplier: 10_000,
    })
    expect(short.title.size).toBe(18)
    expect(long.title.size).toBeLessThan(18)
    expect(long.title.size).toBeGreaterThanOrEqual(12)
  })

  it("splits a long domain name onto two lines instead of overlapping", () => {
    const seven = [
      ...bars,
      { key: "uk", label: "UK", value: 1 },
      { key: "ie", label: "Ireland", value: 1 },
      { key: "nz", label: "New Zealand", value: 1 },
      { key: "au", label: "Australia", value: 1 },
    ]
    const l = layoutChart(seven, { title: "x", multiplier: 10_000 })
    const lines = Object.fromEntries(l.bars.map((b) => [b.key, b.labelLines]))
    expect(lines.nz).toEqual(["New", "Zealand"])
    expect(lines.za).toEqual(["South", "Africa"])
    expect(lines.ca).toEqual(["Canada"])
    expect(l.xLabelSize).toBe(12)
    // Two lines of labels need more room beneath the plot than one.
    const one = layoutChart(bars.slice(1, 3), {
      title: "x",
      multiplier: 10_000,
    })
    expect(l.plot.y + l.plot.h).toBeLessThan(one.plot.y + one.plot.h)
  })

  it("shrinks data labels when a value has many digits", () => {
    const wide = layoutChart(
      [
        ...bars,
        { key: "uk", label: "UK", value: 123456.7 },
        { key: "ie", label: "Ireland", value: 1 },
        { key: "nz", label: "New Zealand", value: 1 },
        { key: "au", label: "Australia", value: 1 },
      ],
      { title: "x", multiplier: 10_000 }
    )
    expect(wide.dataLabelSize).toBeLessThan(12)
    expect(wide.dataLabelSize).toBeGreaterThanOrEqual(8)
  })
})
