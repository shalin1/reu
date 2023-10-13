const {read, utils} = require('xlsx')
const fs = require('fs')
const path = require('path')

const readAndTransformFile = async (filePath) => {
  const fullPath = path.resolve(filePath)
  const fileBuffer = fs.readFileSync(fullPath)
  const json = read(fileBuffer, {type: 'buffer'})
  console.log(json)
}

readAndTransformFile('./Oct 12.ndjson')
