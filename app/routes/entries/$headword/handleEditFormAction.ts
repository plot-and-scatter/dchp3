import {
  AddDefinitionFistNoteSchema,
  addDefinitionFistNote,
} from "~/services/controllers/entry/addDefinitionFistNote"
import {
  AddMeaningToEntrySchema,
  addMeaningToEntry,
} from "~/services/controllers/entry/addMeaningToEntry"
import {
  AddQuotationsSchema,
  addQuotations,
} from "~/services/controllers/meaning/addQuotations"
import {
  AddSeeAlsoSchema,
  addSeeAlso,
} from "~/services/controllers/meaning/addSeeAlso"
import {
  DeleteMeaningSchema,
  deleteMeaning,
} from "~/services/controllers/meaning/deleteMeaning"
import {
  DeleteQuotationSchema,
  deleteQuotation,
} from "~/services/controllers/entry/deleteQuotation"
import {
  DeleteSeeAlsoSchema,
  deleteSeeAlso,
} from "~/services/controllers/entry/deleteSeeAlso"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import {
  UpdateEditingCommentSchema,
  updateEditingComment,
} from "~/services/controllers/entry/updateEditingComment"
import {
  UpdateEditingStatusSchema,
  updateEditingStatus,
} from "~/services/controllers/entry/updateEditingStatus"
import {
  UpdateEditingToolsSchema,
  updateEditingTools,
} from "~/services/controllers/entry/updateEditingTools"
import {
  UpdateMeaningSchema,
  updateMeaning,
} from "~/services/controllers/meaning/updateMeaning"
import {
  UpdateOrDeleteDefinitionFistNoteSchema,
  updateOrDeleteDefinitionFistNote,
} from "~/services/controllers/entry/updateOrDeleteDefinitionFistNote"
import { parseWithZod } from "@conform-to/zod"
import { json } from "@remix-run/server-runtime"
import { z } from "zod"
import {
  UpdateEntrySchema,
  updateEntry,
} from "~/services/controllers/entry/updateEntry"
import { AddImageSchema, addImage } from "~/services/controllers/entry/addImage"
import {
  DeleteImageSchema,
  deleteImage,
} from "~/services/controllers/image/deleteImage"
import {
  UpdateImageSchema,
  updateImage,
} from "~/services/controllers/image/updateImage"

const unionSchema = z.discriminatedUnion("entryEditorFormAction", [
  UpdateEntrySchema,
  AddMeaningToEntrySchema,
  UpdateMeaningSchema,
  DeleteMeaningSchema,
  AddQuotationsSchema,
  DeleteQuotationSchema,
  AddSeeAlsoSchema,
  DeleteSeeAlsoSchema,
  UpdateOrDeleteDefinitionFistNoteSchema,
  AddDefinitionFistNoteSchema,
  UpdateEditingToolsSchema,
  UpdateEditingStatusSchema,
  UpdateEditingCommentSchema,
  AddImageSchema,
  DeleteImageSchema,
  UpdateImageSchema,
])

type ActionMap = {
  [K in EntryEditorFormActionEnum]: (
    value: Extract<SubmissionValue, { entryEditorFormAction: K }>
  ) => Promise<void>
}

const actionMap: ActionMap = {
  [EntryEditorFormActionEnum.UPDATE_ENTRY]: updateEntry,
  [EntryEditorFormActionEnum.ADD_MEANING]: addMeaningToEntry,
  [EntryEditorFormActionEnum.UPDATE_MEANING]: updateMeaning,
  [EntryEditorFormActionEnum.DELETE_MEANING]: deleteMeaning,
  [EntryEditorFormActionEnum.ADD_QUOTATIONS]: addQuotations,
  [EntryEditorFormActionEnum.DELETE_QUOTATION]: deleteQuotation,
  [EntryEditorFormActionEnum.ADD_SEE_ALSO]: addSeeAlso,
  [EntryEditorFormActionEnum.DELETE_SEE_ALSO]: deleteSeeAlso,
  [EntryEditorFormActionEnum.DEFINITION_FIST_NOTE]:
    updateOrDeleteDefinitionFistNote,
  [EntryEditorFormActionEnum.ADD_DEFINITION_FIST_NOTE]: addDefinitionFistNote,
  [EntryEditorFormActionEnum.EDITING_TOOLS]: updateEditingTools,
  [EntryEditorFormActionEnum.EDITING_STATUS]: updateEditingStatus,
  [EntryEditorFormActionEnum.COMMENT]: updateEditingComment,
  [EntryEditorFormActionEnum.DELETE_IMAGE]: deleteImage,
  [EntryEditorFormActionEnum.ADD_IMAGE]: addImage,
  [EntryEditorFormActionEnum.EDIT_IMAGE]: updateImage,
}

type SubmissionValue = z.infer<typeof unionSchema>

export async function handleEditFormAction(formData: FormData) {
  const submission = parseWithZod(formData, { schema: unionSchema })

  console.log(submission)

  // TODO: When we link this up with the form that actually shows errors,
  // we can remove this.
  if (submission.status !== "success") {
    throw new Error(JSON.stringify(submission.error))
  }

  const action = submission.value.entryEditorFormAction

  if (actionMap[action]) {
    await actionMap[action](
      submission.value as Extract<SubmissionValue, typeof action>
    )
    return submission
  } else {
    throw new Error(`No action found for ${action}`)
  }
}
