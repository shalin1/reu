import { createClient, type ClientConfig } from '@sanity/client'

const token = import.meta.env.VITE_SANITY_TOKEN as string
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string
// find this at manage.sanity.io or in your sanity.json

const config: ClientConfig = {
  apiVersion: '2023-06-16', // use a UTC date string
  projectId,
  dataset: 'production', // this is from those question during 'sanity init'
  useCdn: false, // `false` if you want to ensure fresh data
  token,
}

const sanityClient = createClient(config)

export default sanityClient
