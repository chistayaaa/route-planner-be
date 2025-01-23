import { getPayload } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from '../collections/Users.js'
import { Media } from '../collections/Media.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const config = buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [payloadCloudPlugin()],
})

export async function createInitialUser() {
  try {
    const payload = await getPayload({ config })

    try {
      const user = await payload.create({
        collection: 'users',
        data: {
          email: 'chistayaaa@yandex.ru',
          password: '123456',
          name: 'Admin User',
          roles: ['admin'],
        },
      })

      console.log('The user was created:', user)
      process.exit(0)
    } catch (err) {
      console.error('Error while creating an user:', err?.message || err)
      if (err?.data?.errors) {
        console.error('Details of the errors:', JSON.stringify(err.data.errors, null, 2))
      }
      process.exit(1)
    }
  } catch (initError) {
    console.error('Error initializing Payload:', initError)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  createInitialUser().catch((err) => {
    console.error('Uncatch error:', err)
    process.exit(1)
  })
}
