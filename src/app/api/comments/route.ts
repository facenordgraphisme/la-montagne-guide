import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { settingsQuery } from '@/sanity/lib/queries'

// Client avec permission d'écriture
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-05-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { postId, name, rating, content, passcode } = body

    if (!postId || !name || !rating || !content || !passcode) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    // Récupérer le code client configuré dans Sanity
    const settings = await writeClient.fetch(settingsQuery)
    const expectedPasscode = settings?.clientPasscode || 'montagne2026'

    if (passcode.trim() !== expectedPasscode.trim()) {
      return NextResponse.json({ error: 'Code d\'accès client incorrect.' }, { status: 403 })
    }

    // Créer le commentaire dans Sanity (non approuvé par défaut pour modération)
    await writeClient.create({
      _type: 'comment',
      name: name.trim(),
      rating: Number(rating),
      content: content.trim(),
      post: {
        _type: 'reference',
        _ref: postId,
        _weak: true,
      },
      approved: false,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Comment creation error:', error)
    return NextResponse.json({ error: 'Une erreur s\'est produite lors de la soumission.' }, { status: 500 })
  }
}
