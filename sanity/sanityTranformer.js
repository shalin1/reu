const Papa = require('papaparse')
const fs = require('fs')
const path = require('path')

const transformReunionFile = (row) => {
  const fileCode = row['File Code'].trim()
  const information = row['Information']
  const id = `${sanitizeId(fileCode)}`

  const informationBlock = {
    _type: 'block',
    markDefs: [],
    children: [
      {
        _type: 'span',
        text: information,
        marks: [],
      },
    ],
  }

  return {
    _id: sanitizeId(id),
    _type: 'reunionFile',
    title: fileCode,
    description: [informationBlock],
  }
}

const sanitizeId = (id) => {
  return id.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/^-/, '')
}

const readAndTransformFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(filePath)
    const fileStream = fs.createReadStream(fullPath)

    const documents = []
    const idCounts = {}
    Papa.parse(fileStream, {
      header: true,
      step: (result) => {
        const document = transformReunionFile(result.data)
        const documentId = document._id
        if (!documentId) return
        if (documents.find((doc) => doc._id === documentId)) return
        const count = idCounts[documentId] || 0
        idCounts[documentId] = count + 1
        if (count > 0) {
          document._id = `${documentId}-${count}`
        }
        documents.push(document)
      },
      error: reject,
      complete: () => resolve(documents),
    })
  })
}

readAndTransformFile('../src/data/tsvfilestest.tsv')
  .then((documents) => {
    const ndjson = documents
      .filter(({_id}) => _id)
      .map((doc) => JSON.stringify(doc))
      .join('\n')
    fs.writeFileSync('./sanityDocuments.ndjson', ndjson)
  })
  .catch((err) => console.error(err))
