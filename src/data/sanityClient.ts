import { createClient, type ClientConfig } from '@sanity/client'

const token = import.meta.env.VITE_SANITY_STUDIO_TOKEN as string
const projectId = import.meta.env.VITE_SANITY_STUDIO_PROJECT_ID as string

const config: ClientConfig = {
  apiVersion: '2023-06-16', // use a UTC date string
  dataset: 'production', // this is from those question during 'sanity init'
  useCdn: false, // `false` if you want to ensure fresh data
  projectId: 'rxwn78ar',
  token:
    'sk10ftX6GJZXbQFbqdB8rrULDlDcyWM6NagGI2J1fGJIx5A52NBPGTmbXP3QoCwZl2vZ67emHsC235evQ6WQfAwq9VvvtjYFmnSzdomq8olIxYFKCWdH50MfOooabvcru8HGEqs9pSdxWBU41u8ZIxh7hMC46nR1FPTsdO8MaF6feaH1plmZ',
}

const sanityClient = createClient(config)

export default sanityClient
