import { useState } from 'react'
import { useClient, type DocumentActionProps } from 'sanity'

export function DeleteTagEverywhereAction(props: DocumentActionProps) {
  const { id, type, onComplete } = props
  const client = useClient({ apiVersion: '2024-05-01' })
  const [confirming, setConfirming] = useState(false)
  const [count, setCount] = useState<number | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (type !== 'tag') return null

  async function run() {
    setRunning(true)
    setError(null)
    try {
      const refIds: string[] = await client.fetch(
        `*[references($id) || references($draftId)]._id`,
        { id, draftId: `drafts.${id}` },
      )
      const tx = client.transaction()
      for (const docId of refIds) {
        tx.patch(docId, p => p.unset([
          `tags[_ref=="${id}"]`,
          `relatedTags[_ref=="${id}"]`,
        ]))
      }
      tx.delete(`drafts.${id}`)
      tx.delete(id)
      await tx.commit({ visibility: 'sync' })
      setConfirming(false)
      onComplete()
    } catch (e: any) {
      console.error('[DeleteTagEverywhere]', e)
      setError(e?.message || String(e))
    } finally {
      setRunning(false)
    }
  }

  return {
    label: running ? 'Suppression…' : 'Supprimer partout',
    tone: 'critical' as const,
    disabled: running,
    onHandle: async () => {
      const n: number = await client.fetch(`count(*[references($id) || references($draftId)])`, { id, draftId: `drafts.${id}` })
      setCount(n)
      setConfirming(true)
    },
    dialog: confirming && {
      type: 'confirm' as const,
      tone: 'critical' as const,
      message: error
        ? `Échec : ${error}`
        : `Ce tag sera retiré de ${count ?? 0} document${(count ?? 0) > 1 ? 's' : ''} (articles, séjours), puis supprimé définitivement. Continuer ?`,
      onCancel: () => { setConfirming(false); setError(null) },
      onConfirm: run,
    },
  }
}
