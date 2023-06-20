const {read, utils} = require('xlsx')
const path = require('path')
const fs = require('fs')

export default const importExcelFile = async (filePath) => {
  const fullPath = path.resolve(filePath)
  const fileBuffer = fs.readFileSync(fullPath)
  const parsedFile = read(fileBuffer, {type: 'buffer'}) // parse the file
  const sheet = parsedFile.Sheets[wb.SheetNames[0]] // get the first worksheet
  const json = utils.sheet_to_json(sheet) // generate objects
  console.log('excel data', json)
  return json
}
