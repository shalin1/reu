import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_PROJECT_ID as string

export default defineCliConfig({
  api: {
    projectId,
    dataset: 'production'
  }
})
