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
    {
      name: 'pages',
      type: 'array',
      title: 'Pages',
      of: [{type: 'reference', to: [{type: 'pageTest'}], readOnly: true}],
      readOnly: true,
    },
  ],
}
