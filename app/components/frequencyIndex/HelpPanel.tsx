import { useEffect, useState } from "react"
import FAIcon from "~/components/elements/Icons/FAIcon"
import Button from "~/components/elements/LinksAndButtons/Button"

// Everything a new user needs to know, in one panel that stays hidden
// until asked for, so it does not crowd the form for people who know it:
// how the term field is read, then the keyboard loop (Enter opens the
// search, Cmd+W brings the student back to the same field, the number goes
// in, Enter moves on), then the warnings.
export default function HelpPanel({
  onClose,
  closeButtonClassName,
}: {
  onClose: () => void
  closeButtonClassName?: string
}) {
  // Decided after hydration so the server and first client render agree.
  const [mod, setMod] = useState("Cmd / Ctrl")
  useEffect(() => {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform)
    setMod(isMac ? "Cmd" : "Ctrl")
  }, [])

  const Key = ({ children }: { children: React.ReactNode }) => (
    <kbd className="rounded border border-gray-400 bg-gray-100 px-1 py-0.5 font-mono text-xs">
      {children}
    </kbd>
  )

  return (
    <section
      aria-label="Help"
      className="rounded border border-gray-300 bg-gray-50 p-4 text-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold">
          <FAIcon iconName="fa-circle-question" /> How to use this tool
        </h2>
        <Button
          type="button"
          appearance="primary"
          variant="outline"
          size="small"
          onClick={onClose}
          aria-label="Close help"
          className={closeButtonClassName}
        >
          <FAIcon iconName="fa-xmark" /> Close
        </Button>
      </div>

      <h3 className="mt-5 font-semibold">What the fields mean</h3>
      <ul className="mt-2 list-disc space-y-2 pl-5">
        <li>
          <strong>Term.</strong> A term with spaces is searched as a phrase. To
          require two words anywhere on the page, join them with{" "}
          <code>AND</code> in capitals: <code>toque AND hockey</code> searches
          for <code>&quot;toque&quot; &quot;hockey&quot;</code>.
        </li>
        <li>
          <strong>Normalizer.</strong> The common word whose count stands in for
          the size of each national web. Keep it the same across lookups you
          mean to compare.
        </li>
        <li>
          <strong>Exclusions.</strong> Leave out pages that match them. Enter a
          word to drop pages containing it (for example <code>monkey</code> when
          counting &ldquo;toque&rdquo;), or <code>site:example.com</code> to
          drop a whole site. Put a phrase in quotes: <code>"skate bag"</code>{" "}
          drops pages with that phrase, while <code>skate bag</code> drops every
          page containing either word, which for a search on &ldquo;bag
          skate&rdquo; is every page. Separate pieces with spaces. They apply to
          the term search on every domain, and never to the normalizer. To
          change the exclusions of a saved lookup, use &ldquo;Try different
          exclusions&rdquo; on its page; it starts a new lookup, so the two can
          be compared.
        </li>
        <li>
          <strong>Multiplier.</strong> Scales the index for readability only.
        </li>
      </ul>

      <h3 className="mt-5 font-semibold">Before you start</h3>
      <p className="mt-2">
        Google personalizes results by account and location. For counts that
        other people can reproduce, use a private window or a browser profile
        that is not signed in to Google.
      </p>

      <h3 className="mt-5 font-semibold">Keyboard-only workflow</h3>
      <ol className="mt-2 list-decimal space-y-2 pl-6">
        <li>
          Type the term and press <Key>Enter</Key>. The table appears and the
          cursor lands in the first count field.
        </li>
        <li>
          In an empty count field, <Key>Enter</Key> opens that Google search in
          a new tab.
        </li>
        <li>
          Read the &ldquo;About N results&rdquo; line under Google&rsquo;s
          search box. If Google does not show it, open <em>Tools</em>: press (or
          hold) <Key>Tab</Key> until <em>Tools</em> is highlighted, then
          <Key>Space</Key>, and the line appears. With fewer than ten results
          there is no line: count the results yourself.
        </li>
        <li>
          Press <Key>{mod}</Key>+<Key>W</Key> to close the tab. You are back
          here, in the same field.
        </li>
        <li>
          Type the number. Commas are optional, and you can paste the whole
          &ldquo;About 1,230,000 results&rdquo; line; only the number is kept.
          <Key>Enter</Key> or <Key>Tab</Key> moves to the next field. A field
          that is already filled, such as a reused normalizer count, is skipped
          over with <Key>Enter</Key> too.
        </li>
        <li>
          When every count is in, <Key>{mod}</Key>+<Key>Enter</Key> saves the
          lookup.
        </li>
      </ol>

      <h3 className="mt-5 font-semibold">Expect CAPTCHAs</h3>
      <p className="mt-2">
        Many successive searches look like automated traffic to Google, so it
        will sometimes stop you with an &ldquo;I&rsquo;m not a robot&rdquo;
        check, even several times in one lookup. Solve it and carry on. Pausing
        a few seconds between searches can trigger it less often.
      </p>

      <h3 className="mt-5 font-semibold">The chart for the entry</h3>
      <p className="mt-2">
        Every saved lookup has a chart in the DCHP-2 format under its table: one
        column per domain labelled ".ca", "US", ".uk" and so on, the index on
        the y-axis, one decimal place on each column, no legend, 9 x 14 cm.
        Download it as a PNG and upload it to the entry as an image; the caption
        to type is shown beside the button. If a count is corrected later, the
        chart changes with it, so download it again.
      </p>

      <h3 className="mt-5 font-semibold">Your work is saved as you go</h3>
      <p className="mt-2">
        Counts you have typed are kept in this browser until you save the
        lookup, so closing the tab by mistake loses nothing. Come back to this
        page and they are restored.
      </p>
    </section>
  )
}
