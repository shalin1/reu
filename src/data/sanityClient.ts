import { createClient, type ClientConfig } from '@sanity/client'

const token = process.env.VITE_SANITY_STUDIO_TOKEN as string
const projectId = process.env.VITE_SANITY_STUDIO_PROJECT_ID as string

const config: ClientConfig = {
  apiVersion: '2023-06-16', // use a UTC date string
  dataset: 'production', // this is from those question during 'sanity init'
  useCdn: false, // `false` if you want to ensure fresh data
  projectId,
  token,
}

const sanityClient = createClient(config)

export default sanityClient
