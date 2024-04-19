import { createClient, type ClientConfig } from '@sanity/client'

const token = import.meta.env.VITE_SANITY_TOKEN as string

const config: ClientConfig = {
  apiVersion: '2023-06-16', // use a UTC date string
  projectId: 'rxwn78ar', // find this at manage.sanity.io or in your sanity.json
  dataset: 'production', // this is from those question during 'sanity init'
  useCdn: false, // `false` if you want to ensure fresh data
  token,
}

const sanityClient = createClient(config)

export default sanityClient
