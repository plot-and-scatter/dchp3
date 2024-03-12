import DictionaryVersion from "../DictionaryVersion"
import HandNoteBlock from "../HandNoteBlock"
import GeneralLabels from "./GeneralLabels"
import Etymology from "./Etymology"
import SpellingVariants from "./SpellingVariants"
import { Link } from "../elements/LinksAndButtons/Link"
import SanitizedTextSpan from "../SanitizedTextSpan"
import EditIcon from "../elements/Icons/EditIcon"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import HeadwordText from "./HeadwordText"
import Dagger from "./Dagger"
import HeadwordHandNote from "./HeadwordHandNote"
import clsx from "clsx"
import NonCanadianism from "./NonCanadianism"
import EntryEditorForm from "../EntryEditor/EntryEditorForm/EntryEditorForm"
import { EntryEditorFormActionEnum } from "../EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import Button from "../elements/LinksAndButtons/Button"
import SaveIcon from "../elements/Icons/SaveIcon"
import { SecondaryHeader } from "../elements/Headings/SecondaryHeader"
import BackIcon from "../elements/Icons/BackIcon"
import { TertiaryHeader } from "../elements/Headings/TertiaryHeader"

interface HeadwordProps {
  entry: LoadedEntryDataType
  showEditButton?: boolean
  isEditingMode?: boolean
}

const Headword = ({
  entry,
  showEditButton,
  isEditingMode,
}: HeadwordProps): JSX.Element => {
  const contents = (
    <div className="flex flex-col gap-2 leading-tight md:gap-4" id="headword">
      <div className="flex items-start justify-between border-b-2 border-gray-500 py-4">
        <div
          className={clsx(
            `flex`,
            isEditingMode
              ? `flex-1 flex-col items-start gap-4`
              : `flex-row items-center gap-1`
          )}
        >
          <h1
            className={clsx(
              `gap-x- flex flex-row whitespace-nowrap text-3xl leading-tight md:text-5xl`,
              isEditingMode ? "gap-x-4" : "gap-x-1"
            )}
          >
            <HeadwordText
              headword={entry.headword}
              isEditingMode={isEditingMode}
            />
            <Dagger dagger={entry.dagger} isEditingMode={isEditingMode} />
            <NonCanadianism
              isNonCanadianism={entry.no_cdn_conf}
              isEditingMode={isEditingMode}
            />
          </h1>
          <div
            className={clsx(
              "flex flex-row gap-x-2",
              isEditingMode ? `w-full items-start gap-x-4` : `items-center`
            )}
          >
            <Etymology entry={entry} isEditingMode={isEditingMode} />
            <GeneralLabels entry={entry} isEditingMode={isEditingMode} />
          </div>
        </div>
        <DictionaryVersion entry={entry} isEditingMode={isEditingMode} />
      </div>
      <SpellingVariants entry={entry} isEditingMode={isEditingMode} />
      <HeadwordHandNote entry={entry} isEditingMode={isEditingMode} />
      {entry.no_cdn_conf && !isEditingMode && (
        <div className="border border-red-700 bg-red-300 p-3">
          <TertiaryHeader>Non-Canadianism</TertiaryHeader>
          <p>
            This is a word that our editors have determined is not a
            Canadianism.
          </p>
        </div>
      )}
    </div>
  )

  if (isEditingMode) {
    return (
      <EntryEditorForm
        entry={entry}
        formAction={EntryEditorFormActionEnum.UPDATE_ENTRY}
        className="border border-gray-400 p-8 shadow-lg"
      >
        <div className="mb-8">
          <Link
            to={`/entries/${entry.headword}`}
            className="w-fit"
            appearance="secondary"
          >
            <BackIcon /> Return to entry
          </Link>
        </div>
        <SecondaryHeader>
          <EditIcon /> Edit headword
        </SecondaryHeader>
        {contents}
        <div className="mt-8">
          <Button appearance="success" size="large">
            <SaveIcon /> Save changes to headword
          </Button>
        </div>
      </EntryEditorForm>
    )
  }

  return contents
}

export default Headword
