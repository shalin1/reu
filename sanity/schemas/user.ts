export default {
  name: 'user',
  type: 'document',
  title: 'User',
  fields: [
    {
      name: 'email',
      type: 'string',
      title: 'Email'
    },
    {
      name: 'name',
      type: 'string',
      title: 'Name'
    },
    {
      name: 'auth0UserId',
      type: 'string',
      title: 'Users'
    }
  ]
}
