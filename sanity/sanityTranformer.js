const {read, utils} = require('xlsx')
const fs = require('fs')
const path = require('path')

const transformReunionFile = (row) => {
  const title = row['File Code'].trim()
  const q1r1 = row['sm0']

  return {
    _id: titleToId(title),
    _type: 'reunionFile',
    title: title,
    description: [descriptionBlock],
    q1r1,
  }
}

const titleToId = (title) => title.replace(/\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '')

const readAndTransformFile = async (filePath) => {
  const fullPath = path.resolve(filePath)
  const fileBuffer = fs.readFileSync(fullPath)
  const wb = read(fileBuffer, {type: 'buffer'}) // parse the file
  const ws = wb.Sheets[wb.SheetNames[0]] // get the first worksheet
  const data = utils.sheet_to_json(ws) // generate objects

  // New code for tracking seen ids
  const seenIds = new Set()
  return data.map(transformReunionFile).filter((doc) => {
    if (!doc._id || seenIds.has(doc._id)) {
      return false
    }
    seenIds.add(doc._id)
    return true
  })
}

readAndTransformFile('../data/dec 26.xlsx?url')
  .then((documents) => {
    const ndjson = documents.map((doc) => JSON.stringify(doc)).join('\n')
    // fs.writeFileSync('./sanityDocuments.ndjson', ndjson)
  })
  .catch((err) => console.error(err))
