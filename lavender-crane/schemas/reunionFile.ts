export default {
  name: 'reunionFile',
  type: 'document',
  title: 'Reunion File',
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
