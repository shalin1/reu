export type SanityDocument = {
  _id: string
  _type: string
  title: string
  description: Block[]
}

export type Block = {
  _type: 'block'
  children: Span[]
}

export type Span = {
  _type: 'span'
  text: string
  marks: any[]
}
