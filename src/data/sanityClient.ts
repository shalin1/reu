import { createClient, type ClientConfig } from '@sanity/client'

const config: ClientConfig = {
  apiVersion: '2023-06-16', // use a UTC date string
  projectId: 'rxwn78ar', // find this at manage.sanity.io or in your sanity.json
  dataset: 'production', // this is from those question during 'sanity init'
  useCdn: false, // `false` if you want to ensure fresh data
  token:
    'sk3usQSxx6TAiQ7Z6fOhnLmeFSehVTQ3NMaB8hmhBuYOSpwTTes9yyX8i5z3gKJB6xf2qFJ9lEIQJsiKdBe5qQNwpnBC992ajzqAUuE60qyYPrBnFBd6gwIUNCWUNLYSJtJRJrKGuTZo3XJ9GTW0IPSbhJfTJ6ynmKmwU76lQHpmWWshbggL',
}

const sanityClient = createClient(config)

export default sanityClient
