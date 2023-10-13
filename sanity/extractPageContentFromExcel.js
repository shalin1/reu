const {read, utils} = require('xlsx')
const fs = require('fs')
const path = require('path')

const transformReunionFile = (row) => {
  const fileTitle = row['File Code'].trim()
  const pageNumber = row['Set#']?.split(' ')[0]

  return {
    _id: titleToId(fileTitle) + pageNumber,
    _type: 'page',
    pageNumber,
    title: fileTitle + ' ' + pageNumber,
    fileTitle,
    q1r1: row['sm0'],
    q1r2: row['sm1'],
    q1r3: row['sm2'],
    q1r4: row['sm3'],
    q1r5: row['sm4'],
    q1r6: row['sm5'],
    q1r7: row['sm12'],
    q1r8: row['sm13'],
    q2r1: row['sm14'],
    q2r2: row['sm15'],
    q2r3: row['sm23'],
    q2r4: row['sm24'],
    q2r5: row['sm25'],
    q2r6: row['sm34'],
    q2r7: row['sm35'],
    q2r8: row['sm45'],
    q3r1: row['sm124'],
    q3r2: row['sm123'],
    q3r3: row['sm125'],
    q3r4: row['sm134'],
    q3r5: row['sm135'],
    q3r6: row['sm145'],
    q3r7: row['sm234'],
    q3r8: row['sm235'],
    q4r1: row['sm245'],
    q4r2: row['sm345'],
    q4r3: row['sm1234'],
    q4r4: row['sm1235'],
    q4r5: row['sm1245'],
    q4r6: row['sm1345'],
    q4r7: row['sm2345'],
    q4r8: row['sm12345'],
  }
}

const titleToId = (title) => title.replace(/\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '')

const readAndTransformFile = async (filePath) => {
  const fullPath = path.resolve(filePath)
  const fileBuffer = fs.readFileSync(fullPath)
  const wb = read(fileBuffer, {type: 'buffer'}) // parse the file
  const ws = wb.Sheets[wb.SheetNames[0]] // get the first worksheet
  const data = utils.sheet_to_json(ws) // generate objects

  return data.map(transformReunionFile)
}

readAndTransformFile('../src/data/Oct 12.xlsx')
  .then((documents) => {
    const ndjson = documents.map((doc) => JSON.stringify(doc)).join('\n')
    fs.writeFileSync('./reunionPages.ndjson', ndjson)
  })
  .catch((err) => console.error(err))
