import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"

export async function handleEditFormAction(
  entryEditorFormAction: EntryEditorFormActionEnum,
  data: any
) {
  switch (entryEditorFormAction) {
    case EntryEditorFormActionEnum.ENTRY:
      await updateEntry(data)
      break
    case EntryEditorFormActionEnum.ADD_MEANING:
      await addMeaningToEntry(data)
      break
    case EntryEditorFormActionEnum.MEANING:
      await updateMeaning(data)
      break
    case EntryEditorFormActionEnum.DELETE_MEANING:
      await deleteMeaning(data)
      break
    case EntryEditorFormActionEnum.QUOTATION:
      await addQuotations(data)
      break
    case EntryEditorFormActionEnum.DELETE_QUOTATION:
      await deleteQuotations(data)
      break
    case EntryEditorFormActionEnum.SEE_ALSO:
      await addSeeAlso(data)
      break
    case EntryEditorFormActionEnum.DELETE_SEE_ALSO:
      await deleteSeeAlso(data)
      break
    case EntryEditorFormActionEnum.DEFINITION_FIST_NOTE:
      await updateOrDeleteDefinitionFistNote(data)
      break
    case EntryEditorFormActionEnum.ADD_DEFINITION_FIST_NOTE:
      await addDefinitionFistNote(data)
      break
    case EntryEditorFormActionEnum.EDITING_TOOLS:
      await updateEditingTools(data)
      break
    case EntryEditorFormActionEnum.EDITING_STATUS:
      await updateEditingStatus(data)
      break
    case EntryEditorFormActionEnum.COMMENT:
      await updateEditingComment(data)
      break
    case EntryEditorFormActionEnum.DELETE_IMAGE:
      await deleteImage(data)
      break
    // case attributeEnum.ADD_IMAGE:
    //   await addImage(data)
    //   break
    case EntryEditorFormActionEnum.EDIT_IMAGE:
      await editImage(data)
      break
    default:
      throw new Error(`Unknown entryEditorFormAction ${entryEditorFormAction}`)
  }
}
