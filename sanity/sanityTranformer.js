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
  const pageTitles = new Set()
  const seenPageIds = new Set()
  const dupeFiles = []
  const reunionFiles = []
  const pages = []

  data.forEach((row) => {
    const title = row['File Code'].trim()
    if (!title || title === 's') return

    const reunionFileId = titleToReunionFileId(title)
    const description = textToBlock(row['Information'])
    const reunionFileRef = {
      _type: 'reference',
      _ref: reunionFileId,
    }
    const pageNum = row['Set#']

    if (seenPageIds.has(titleToPageId(title, pageNum))) return
    seenPageIds.add(titleToPageId(title, pageNum))

    pages.push({
      _type: 'reunionFile',
      _id: titleToPageId(title, pageNum),
      title: textToBlock(title),
      pageNum,
      numPages: row['Set total'],
      description: reunionFileRef,
      sm0: row['Goto sm0'],
      gotoSm0: textToBlock(row['sm0']),
    })

    if (pageTitles.has(reunionFileId)) return
    pageTitles.add(reunionFileId)

    reunionFiles.push({
      _id: reunionFileId,
      _type: 'description',
      title,
      description,
    })
  })

  const sanityReunionFiles = reunionFiles.map((doc) => JSON.stringify(doc)).join('\n')
  const sanityPages = pages.map((doc) => JSON.stringify(doc)).join('\n')

  return {reunionFiles, pages}
}

const titleToReunionFileId = (title) => {
  return title.replace(/\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '')
}

const titleToPageId = (title, pageNum) =>
  pageNum ? `${titleToReunionFileId(title)}-${pageNum.trim()}` : titleToReunionFileId(title)

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
importExcelAsJson('../src/data/june17.xlsx').then((data) => {
  const {sanityReunionFiles, sanityPages} = jsonToSanity(data)
  fs.writeFileSync('./reunionFiles.ndjson', sanityReunionFiles)
  fs.writeFileSync('./pages.ndjson', sanityPages)
})
