const jsonToSanity = (data) => {
  const seenDescriptionIds = new Set()
  const descriptions = []
  const reunionFiles = []

  data.map((row) => {
    const fileTitle = row['File Code'].trim()
    if (!fileTitle) return
    const title = textToBlock(fileTitle)
    const descriptionId = titleToDescriptionId(title)
    const description = textToBlock(row['Information'])
    const page = row['Set#']

    reunionFiles.push({
      _type: 'reunionFile',
      _id: titleToReunionFileId(title),
      title,
      page,
      numPages: row['Set total'],
      description,
      sm0: row['Goto sm0'],
      gotoSm0: textToBlock(row['sm0']),
    })

    if (seenDescriptionIds.has(descriptionId)) return

    descriptions.push({
      _id: descriptionId,
      _type: 'description',
      title,
      description,
    })
  })
}

export const titleToDescriptionId = (title) =>
  title.replace(/\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '')

const titleToReunionFileId = (title) => `${titleToDescriptionId(title)}-${page}`

export const textToBlock = (text) => [
  {
    _type: 'block',
    markDefs: [],
    children: [
      {
        _type: 'span',
        text,
        marks: [],
      },
    ],
  },
]

export default jsonToSanity
