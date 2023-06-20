export default {
  name: 'reunionFile',
  type: 'document',
  title: 'Reunion File',
  fields: [
    {
      name: 'title',
      type: 'array',
      title: 'Title',
      of: [{type: 'block'}],
    },
    {
      name: 'page',
      type: 'string',
      title: 'Page',
      readOnly: true,
    },
    {
      name: 'numPages',
      type: 'string',
      title: 'Num. Pages',
      readOnly: true,
    },
    {
      name: 'description',
      type: 'reference',
      to: [{type: 'description'}],
    },
    {
      name: 'sm0',
      title: 'Submode 0',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'goto_sm0',
      title: 'Submode 0 Goto',
      type: 'string',
    },
    // {
    //   name: 'sm1',
    //   title: 'sm1',
    //   type: 'string',
    // },
    // {
    //   name: 'sm12',
    //   title: 'sm12',
    //   type: 'string',
    // },
    // {
    //   name: 'sm123',
    //   title: 'sm123',
    //   type: 'string',
    // },
    // {
    //   name: 'sm1234',
    //   title: 'sm1234',
    //   type: 'string',
    // },
    // {
    //   name: 'sm12345',
    //   title: 'sm12345',
    //   type: 'string',
    // },
    // {
    //   name: 'sm1235',
    //   title: 'sm1235',
    //   type: 'string',
    // },
    // {
    //   name: 'sm124',
    //   title: 'sm124',
    //   type: 'string',
    // },
    // {
    //   name: 'sm1245',
    //   title: 'sm1245',
    //   type: 'string',
    // },
    // {
    //   name: 'sm125',
    //   title: 'sm125',
    //   type: 'string',
    // },
    // {
    //   name: 'sm13',
    //   title: 'sm13',
    //   type: 'string',
    // },
    // {
    //   name: 'sm134',
    //   title: 'sm134',
    //   type: 'string',
    // },
    // {
    //   name: 'sm1345',
    //   title: 'sm1345',
    //   type: 'string',
    // },
    // {
    //   name: 'sm135',
    //   title: 'sm135',
    //   type: 'string',
    // },
    // {
    //   name: 'sm14',
    //   title: 'sm14',
    //   type: 'string',
    // },
    // {
    //   name: 'sm145',
    //   title: 'sm145',
    //   type: 'string',
    // },
    // {
    //   name: 'sm15',
    //   title: 'sm15',
    //   type: 'string',
    // },
    // {
    //   name: 'sm2',
    //   title: 'sm2',
    //   type: 'string',
    // },
    // {
    //   name: 'sm23',
    //   title: 'sm23',
    //   type: 'string',
    // },
    // {
    //   name: 'sm234',
    //   title: 'sm234',
    //   type: 'string',
    // },
    // {
    //   name: 'sm2345',
    //   title: 'sm2345',
    //   type: 'string',
    // },
    // {
    //   name: 'sm235',
    //   title: 'sm235',
    //   type: 'string',
    // },
    // {
    //   name: 'sm24',
    //   title: 'sm24',
    //   type: 'string',
    // },
    // {
    //   name: 'sm245',
    //   title: 'sm245',
    //   type: 'string',
    // },
    // {
    //   name: 'sm25',
    //   title: 'sm25',
    //   type: 'string',
    // },
    // {
    //   name: 'sm3',
    //   title: 'sm3',
    //   type: 'string',
    // },
    // {
    //   name: 'sm34',
    //   title: 'sm34',
    //   type: 'string',
    // },
    // {
    //   name: 'sm345',
    //   title: 'sm345',
    //   type: 'string',
    // },
    // {
    //   name: 'sm35',
    //   title: 'sm35',
    //   type: 'string',
    // },
    // {
    //   name: 'sm4',
    //   title: 'sm4',
    //   type: 'string',
    // },
    // {
    //   name: 'sm45',
    //   title: 'sm45',
    //   type: 'string',
    // },
    // {
    //   name: 'sm5',
    //   title: 'sm5',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm1',
    //   title: 'Goto sm1',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm12',
    //   title: 'Goto sm12',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm123',
    //   title: 'Goto sm123',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm1234',
    //   title: 'Goto sm1234',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm12345',
    //   title: 'Goto sm12345',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm1235',
    //   title: 'Goto sm1235',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm124',
    //   title: 'Goto sm124',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm1245',
    //   title: 'Goto sm1245',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm125',
    //   title: 'Goto sm125',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm13',
    //   title: 'Goto sm13',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm134',
    //   title: 'Goto sm134',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm1345',
    //   title: 'Goto sm1345',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm135',
    //   title: 'Goto sm135',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm14',
    //   title: 'Goto sm14',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm145',
    //   title: 'Goto sm145',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm15',
    //   title: 'Goto sm15',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm2',
    //   title: 'Goto sm2',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm23',
    //   title: 'Goto sm23',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm234',
    //   title: 'Goto sm234',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm2345',
    //   title: 'Goto sm2345',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm235',
    //   title: 'Goto sm235',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm24',
    //   title: 'Goto sm24',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm245',
    //   title: 'Goto sm245',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm25',
    //   title: 'Goto sm25',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm3',
    //   title: 'Goto sm3',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm34',
    //   title: 'Goto sm34',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm345',
    //   title: 'Goto sm345',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm35',
    //   title: 'Goto sm35',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm4',
    //   title: 'Goto sm4',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm45',
    //   title: 'Goto sm45',
    //   type: 'string',
    // },
    // {
    //   name: 'Goto_sm5',
    //   title: 'Goto sm5',
    //   type: 'string',
    // },
  ],
}
