const jsonToSanity = (data) => {
  const seenDescriptionIds = new Set()
  const seenReunionFileIds = new Set()
  const dupeFiles = []
  const descriptions = []
  const reunionFiles = []

  data.forEach((row) => {
    const fileTitle = row['File Code'].trim()
    if (!fileTitle) return

    const title = textToBlock(fileTitle)
    const descriptionId = titleToDescriptionId(title)
    const description = textToBlock(row['Information'])
    const descriptionRef = {
      _type: 'reference',
      _ref: descriptionId,
    }
    const page = row['Set#']

    if (seenReunionFileIds.has(titleToReunionFileId(title, page))) {
      dupeFiles.push(titleToReunionFileId(title, page))
      return
    }

    reunionFiles.push({
      _type: 'reunionFile',
      _id: titleToReunionFileId(title, page),
      title,
      page,
      numPages: row['Set total'],
      description: descriptionRef,
      sm0: row['Goto sm0'],
      gotoSm0: textToBlock(row['sm0']),
    })

    if (seenDescriptionIds.has(descriptionId)) return

    seenDescriptionIds.add(descriptionId)

    descriptions.push({
      _id: descriptionId,
      _type: 'description',
      title,
      description,
    })
  })

  const sanityDescriptions = descriptions.map((doc) => JSON.stringify(doc)).join('\n')
  const sanityReunionFiles = reunionFiles.map((doc) => JSON.stringify(doc)).join('\n')
  console.log('dupe files', dupeFiles)

  return {sanityDescriptions, sanityReunionFiles}
}

const titleToDescriptionId = (title) => title.replace(/\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '')

const titleToReunionFileId = (title, page) => `${titleToDescriptionId(title)}-${page}`

const textToBlock = (text) => [
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

// export default jsonToSanity
