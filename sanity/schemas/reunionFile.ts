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
      type: 'reference',
      title: 'Description',
      to: [{type: 'reunionFileDescription'}],
    },
    {
      name: 'goto',
      type: 'reference',
      title: 'Goto',
      to: [{type: 'goto'}],
    },
    {
      name: 'submode',
      type: 'reference',
      title: 'Submode',
      to: [{type: 'submode'}],
    },
  ],
}
