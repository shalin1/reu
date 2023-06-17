import fs from 'fs'
import useFiles from '../hooks/useFiles'

const transformReunionFile = (row) => {
  const fileCode = row['File Code'].trim()
  const information = row['Information']
  const setId = row['Set#']
  const id = `${sanitizeId(fileCode)}-${setId}`

  const informationBlock = {
    _type: 'block',
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
  return id.replace(/[^a-zA-Z0-9._-]/g, '').replace(/^-/, '')
}

const dataToNdjson = (data) => {
  const ndjson = data.map((doc) => JSON.stringify(doc)).join('\n')
  fs.writeFileSync('./sanityDocuments.ndjson', ndjson)
}

export const readAndTransformData = (data) => {
  const documents: any[] = []
  data.forEach((document) => {
    const documentId = document._id
    if (!documentId) return
    const transformedDocument = transformReunionFile(document)
    documents.push(transformedDocument)
  })
  return dataToNdjson(documents)
}

const { data } = useFiles()
readAndTransformData(data)
