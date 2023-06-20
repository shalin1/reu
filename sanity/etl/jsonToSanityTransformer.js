const jsonToSanity = (data) => {
  const seenDescriptionIds = new Set()
  const descriptions = []
  const reunionFiles = []

  data.map((row) => {
    const title = row['File Code'].trim()
    if (!title) return

    const descriptionId = titleToDescriptionId(title)
    const description = textToBlock(row['Information'])
    const page = row['Set#']
    const numPages = row['Set total']
    const gotoSm0 = row['Goto sm0']
    const sm0 = textToBlock(row['sm0'])

    reunionFiles.push({
      _type: 'reunionFile',
      _id: titleToReunionFileId(title),
      title,
      page,
      numPages,
      description,
      sm0,
      gotoSm0,
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
