export async function editImage(data: { [k: string]: FormDataEntryValue }) {
  const imageId = getNumberFromFormInput(data.imageId)
  const order = getNumberFromFormInput(data.order)
  const caption = getStringFromFormInput(data.caption)

  await prisma.image.update({
    where: {
      id: imageId,
    },
    data: {
      order: order,
      caption: caption,
    },
  })
}
