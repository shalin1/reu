const fs = require('fs')
const path = require('path')

const ndjsonToStringArray = (filePath) =>
  fs
    .readFileSync(path.resolve(filePath))
    .toString()
    .split('\n')
    .map((line) => JSON.parse(line))
const pagesJsonArray = ndjsonToStringArray('./reunionPages.ndjson')
const filesJsonArray = ndjsonToStringArray('./reunionFiles.ndjson')

const transformedFiles = filesJsonArray
  .map((doc) => {
    // add pageRef to reunion files
    const pages = pagesJsonArray.filter((page) => page?.parent._ref === doc?._id)
    doc.pages = pages.map((page) => ({_type: 'reference', _ref: page?._id}))
    return JSON.stringify(doc)
  })
  .join('\n')

fs.writeFileSync('./reunionFilesWithPageRefs.ndjson', transformedFiles)
