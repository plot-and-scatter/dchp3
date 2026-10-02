import { useRef, useState } from "react"
import Button from "~/components/elements/LinksAndButtons/Button"
import FAIcon from "~/components/elements/Icons/FAIcon"
import type { FrequencyLookupView } from "~/models/frequencyIndex.server"
import {
  AXIS_STROKE,
  CHART_FONT,
  COLUMN_FILL,
  EXPORT_DPI,
  FONT_SIZE,
  GRID_STROKE,
  chartCaption,
  chartDomainLabel,
  chartFileName,
  chartTitle,
  layoutChart,
} from "~/models/frequencyChart"
import { withPngDpi } from "~/utils/pngDpi"

// The DCHP-2 frequency chart for one lookup, drawn as SVG so it is sharp on
// the page, and rendered to a PNG on demand for upload to the entry. Every
// font and colour is an attribute rather than a class, because the SVG is
// serialized and drawn onto a canvas, where the page's stylesheet does not
// reach. The layout comes from app/models/frequencyChart.ts.

type Props = { lookup: FrequencyLookupView }

// Office for Mac bundles Calibri privately; this makes it visible to browsers.
const MAC_FONT_COMMAND =
  'cp "/Applications/Microsoft Word.app/Contents/Resources/DFonts/Calibri"*.ttf ~/Library/Fonts/'

export default function FrequencyIndexChart({ lookup }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [state, setState] = useState<"idle" | "busy" | "failed" | "copied">(
    "idle"
  )
  const captionRef = useRef<HTMLInputElement>(null)
  const [fontNote, setFontNote] = useState(false)

  const layout = layoutChart(
    lookup.rows.map((r) => ({
      key: r.domainKey,
      label: chartDomainLabel(r.domainKey),
      value: r.frequencyIndex,
    })),
    {
      title: chartTitle(lookup.term, lookup.exclusions),
      multiplier: lookup.multiplier,
    }
  )
  const caption = chartCaption(lookup.created)

  const download = async () => {
    const svg = svgRef.current
    if (!svg) return
    setState("busy")
    try {
      const blob = await renderPng(svg, layout.width, layout.height)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = chartFileName(lookup.term, lookup.created)
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setState("idle")
    } catch {
      setState("failed")
    }
  }

  // Same approach as the password-link panel: the clipboard API is absent
  // over plain http (staging), so fall back to execCommand and say so if
  // neither worked.
  const copyCaption = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(caption)
        setState("copied")
        return
      }
    } catch {
      // fall through
    }
    captionRef.current?.select()
    setState(document.execCommand?.("copy") ? "copied" : "failed")
  }

  return (
    <section className="mt-8">
      <h2 className="mb-2 text-xl font-semibold">Chart for the entry</h2>
      <p className="mb-3 max-w-3xl text-sm text-gray-600">
        The DCHP-2 frequency chart: one column per domain, 9 x 14 cm at{" "}
        {EXPORT_DPI} dpi, Calibri (
        <Button
          type="button"
          asLink
          className="italic underline"
          aria-expanded={fontNote}
          onClick={() => setFontNote((v) => !v)}
        >
          not seeing it?
        </Button>
        ), no legend, one decimal place on each column. Download it and upload
        it to the entry as an image, with the caption below. The title is the
        term, then any exclusions as "NOT word".
      </p>
      {fontNote && (
        <div className="mb-3 max-w-3xl rounded border border-gray-300 bg-gray-50 p-3 text-sm">
          <p>
            The chart uses whatever fonts your browser can see. On a Mac, Office
            keeps Calibri inside the Word app, where browsers cannot find it, so
            the chart falls back to Arial. Copy the font files into your own
            fonts folder once, in Terminal, then reload:
          </p>
          <pre className="mt-2 overflow-x-auto rounded bg-white p-2 font-mono text-xs">
            {MAC_FONT_COMMAND}
          </pre>
          <p className="mt-2">
            On Windows, Office installs Calibri for every program, so nothing is
            needed. Without Calibri the chart is still correct, only in a
            different typeface.
          </p>
        </div>
      )}
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        role="img"
        aria-label={`Frequency index of ${lookup.term} by domain`}
        className="h-auto w-full max-w-[560px] border border-gray-200"
        fontFamily={CHART_FONT}
      >
        <rect width={layout.width} height={layout.height} fill="#ffffff" />
        <text
          x={layout.title.x}
          y={layout.title.y}
          textAnchor="middle"
          fontSize={layout.title.size}
          fontWeight="bold"
          fill="#000000"
        >
          {layout.title.text}
        </text>
        <text
          transform={`translate(${layout.yLabel.x} ${layout.yLabel.y}) rotate(-90)`}
          textAnchor="middle"
          fontSize={FONT_SIZE.yLabel}
          fontWeight="bold"
          fill="#000000"
        >
          {layout.yLabel.text}
        </text>
        {layout.ticks.map((t) => (
          <g key={t.value}>
            <line
              x1={layout.plot.x}
              x2={layout.plot.x + layout.plot.w}
              y1={t.y}
              y2={t.y}
              stroke={t.value === 0 ? AXIS_STROKE : GRID_STROKE}
              strokeWidth={0.75}
            />
            <text
              x={layout.plot.x - 4}
              y={t.y}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={FONT_SIZE.axis}
              fill="#000000"
            >
              {t.label}
            </text>
          </g>
        ))}
        {layout.bars.map((b) => (
          <g key={b.key}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={COLUMN_FILL} />
            <text
              x={b.valueX}
              y={b.valueY}
              textAnchor="middle"
              fontSize={layout.dataLabelSize}
              fill="#000000"
            >
              {b.valueLabel}
            </text>
            <text
              x={b.labelX}
              y={b.labelY}
              textAnchor="middle"
              fontSize={layout.xLabelSize}
              fill="#000000"
            >
              {b.labelLines.map((line, i) => (
                <tspan
                  key={line}
                  x={b.labelX}
                  dy={i === 0 ? 0 : layout.xLabelSize * 1.2}
                >
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          appearance="primary"
          variant="outline"
          onClick={download}
          disabled={state === "busy"}
        >
          <FAIcon iconName="fa-download" />{" "}
          {state === "busy" ? "Rendering…" : "Download PNG"}
        </Button>
        <label className="flex items-center gap-2 text-sm">
          <span className="font-semibold">Caption</span>
          <input
            ref={captionRef}
            readOnly
            value={caption}
            onFocus={(e) => e.currentTarget.select()}
            className="w-80 rounded border border-gray-300 px-2 py-1"
            aria-label="Caption for the uploaded chart"
          />
        </label>
        <Button
          type="button"
          appearance="primary"
          variant="outline"
          size="small"
          onClick={copyCaption}
        >
          <FAIcon iconName="fa-copy" />{" "}
          {state === "copied" ? "Copied" : "Copy caption"}
        </Button>
        {state === "failed" && (
          <span className="text-sm text-red-700">
            That did not work in this browser. Select the caption and copy it by
            hand, or try the download again.
          </span>
        )}
      </div>
    </section>
  )
}

/**
 * Draw the SVG onto a canvas at print resolution and return a PNG with the
 * resolution recorded, so Word opens it at 9 x 14 cm. System fonts are used
 * as the browser finds them; without Calibri or Carlito installed the chart
 * falls back to the next font in the list.
 */
const renderPng = async (
  svg: SVGSVGElement,
  widthPt: number,
  heightPt: number
): Promise<Blob> => {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.removeAttribute("class")
  clone.setAttribute("width", String(widthPt))
  clone.setAttribute("height", String(heightPt))
  const xml = new XMLSerializer().serializeToString(clone)
  const svgUrl = URL.createObjectURL(
    new Blob([xml], { type: "image/svg+xml;charset=utf-8" })
  )
  try {
    const img = await loadImage(svgUrl)
    const scale = EXPORT_DPI / 72
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(widthPt * scale)
    canvas.height = Math.round(heightPt * scale)
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("no canvas")
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const png = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    )
    if (!png) throw new Error("no png")
    const stamped = withPngDpi(await png.arrayBuffer(), EXPORT_DPI)
    return new Blob([stamped as BlobPart], { type: "image/png" })
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("svg did not load"))
    img.src = src
  })
