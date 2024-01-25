import { createClient, type ClientConfig } from '@sanity/client'
import { projectId, token } from '../../sanity/environment'

const config: ClientConfig = {
  apiVersion: '2023-06-16', // use a UTC date string
  projectId,
  dataset: 'production', // this is from those question during 'sanity init'
  useCdn: false, // `false` if you want to ensure fresh data
  token,
}

const sanityClient = createClient(config)

export default sanityClient
