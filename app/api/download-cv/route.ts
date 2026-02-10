import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'

export const runtime = 'nodejs'

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'cv', 'Tibor_Balint_CV.pdf')

  if (!fs.existsSync(filePath)) {
    return new Response(JSON.stringify({ error: 'CV file not found' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    })
  }

  const stream = fs.createReadStream(filePath)
  const webStream = Readable.toWeb(stream) as ReadableStream

  return new Response(webStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Tibor_Balint_CV.pdf"',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
