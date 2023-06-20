const fs = require('fs')
const importExcelAsJson = require('./excelToJsonImporter')
const jsonToSanity = require('./jsonToSanityTransformer')

importExcelAsJson('../../src/data/june17.xlsx').then((data) => {
  const {sanityDescriptions, sanityReunionFiles} = jsonToSanity(data)
  fs.writeFileSync('./sanityDescriptions.ndjson', sanityDescriptions)
  fs.writeFileSync('./sanityReunionFiles.ndjson', sanityReunionFiles)
})
