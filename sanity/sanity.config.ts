import {defineConfig, isDev} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {copyPastePlugin} from '@superside-oss/sanity-plugin-copy-paste'
import {getStartedPlugin} from './plugins/sanity-plugin-tutorial'
import {schemaTypes} from './schemas'
import {projectId} from './environment'

const devOnlyPlugins = [getStartedPlugin()]

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
