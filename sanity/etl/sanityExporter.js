const {read, utils} = require('xlsx')
const path = require('path')
const fs = require('fs')

const importExcelAsJson = async (filePath) => {
  const fullPath = path.resolve(filePath)
  const fileBuffer = fs.readFileSync(fullPath)
  const parsedFile = read(fileBuffer, {type: 'buffer'}) // parse the file
  const sheet = parsedFile.Sheets[parsedFile.SheetNames[0]] // get the first worksheet
  const json = utils.sheet_to_json(sheet) // generate objects
  return json
}

const jsonToSanity = (data) => {
  const seenDescriptionIds = new Set()
  const seenReunionFileIds = new Set()
  const dupeFiles = []
  const descriptions = []
  const reunionFiles = []

  data.forEach((row) => {
    const title = row['File Code'].trim()
    if (!title) return

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
      title: textToBlock(title),
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

const titleToDescriptionId = (title) => {
  console.log({title})
  return title.replace(/\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '')
}

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
importExcelAsJson('../../src/data/june17.xlsx').then((data) => {
  const {sanityDescriptions, sanityReunionFiles} = jsonToSanity(data)
  fs.writeFileSync('./sanity-descriptions.ndjson', sanityDescriptions)
  fs.writeFileSync('./sanity-reunionFiles.ndjson', sanityReunionFiles)
})
