export default {
  name: 'reunionFile',
  type: 'document',
  title: 'Description',
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
