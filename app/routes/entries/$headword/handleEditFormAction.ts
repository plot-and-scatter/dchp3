import { addDefinitionFistNote } from "~/services/controllers/entry/addDefinitionFistNote"
import {
  AddMeaningToEntrySchema,
  addMeaningToEntry,
} from "~/services/controllers/entry/addMeaningToEntry"
import { addQuotations } from "~/services/controllers/meaning/addQuotations"
import { addSeeAlso } from "~/services/controllers/meaning/addSeeAlso"
import { deleteImage } from "~/services/controllers/image/deleteImage"
import {
  DeleteMeaningSchema,
  deleteMeaning,
} from "~/services/controllers/meaning/deleteMeaning"
import { deleteQuotations } from "~/services/controllers/entry/deleteQuotations"
import { deleteSeeAlso } from "~/services/controllers/entry/deleteSeeAlso"
import { editImage } from "~/services/controllers/image/updateImage"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { updateEditingComment } from "~/services/controllers/entry/updateEditingComment"
import { updateEditingStatus } from "~/services/controllers/entry/updateEditingStatus"
import { updateEditingTools } from "~/services/controllers/entry/updateEditingTools"
import { updateEntry } from "~/models/entry.server"
import { updateMeaning } from "~/services/controllers/meaning/updateMeaning"
import { updateOrDeleteDefinitionFistNote } from "~/services/controllers/entry/updateDefinitionFistNote"
import { parse } from "@conform-to/zod"
import { json } from "@remix-run/server-runtime"
import { z } from "zod"

export async function handleEditFormAction(formData: FormData) {
  for (const key of formData.keys()) {
    console.log(key, formData.get(key))
  }

  const submission = parse(formData, {
    schema: z.discriminatedUnion("entryEditorFormAction", [
      AddMeaningToEntrySchema,
      DeleteMeaningSchema,
    ]),
  })

  console.log(submission)

  if (submission.intent !== "submit" || !submission.value) {
    return json(submission)
  }

  const entryEditorFormAction = formData.get("entryEditorFormAction")

  const data = Object.fromEntries(formData)

  switch (submission.value.entryEditorFormAction) {
    case EntryEditorFormActionEnum.ENTRY:
      await updateEntry(data)
      break
    case EntryEditorFormActionEnum.ADD_MEANING:
      await addMeaningToEntry(submission.value)
      break
    case EntryEditorFormActionEnum.MEANING:
      await updateMeaning(data)
      break
    case EntryEditorFormActionEnum.DELETE_MEANING:
      await deleteMeaning(submission.value)
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
