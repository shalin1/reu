import {defineConfig, isDev} from 'sanity'
import {visionTool} from '@sanity/vision'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './schemas'
import {getStartedPlugin} from './plugins/sanity-plugin-tutorial'
import {copyPastePlugin} from '@superside-oss/sanity-plugin-copy-paste'

const devOnlyPlugins = [getStartedPlugin()]

const projectId = process.env.SANITY_PROJECT_ID as string

export default defineConfig({
  name: 'default',
  title: 'inri',

  projectId,
  dataset: 'production',

  plugins: [deskTool(), copyPastePlugin(), visionTool(), ...(isDev ? devOnlyPlugins : [])],

  schema: {
    types: schemaTypes
  }
})
