export default {
  name: 'reunionFileDescription',
  type: 'document',
  title: 'Reunion File Description',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'description',
      type: 'array',
      title: 'Description',
      of: [{type: 'block'}],
    },
  ],
}
