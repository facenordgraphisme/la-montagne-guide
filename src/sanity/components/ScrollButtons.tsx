import { ArrowDown, ArrowUp } from 'lucide-react'
import { Button, Card, Stack } from '@sanity/ui'
import type { LayoutProps } from 'sanity'

function scrollDocument(to: 'top' | 'bottom') {
  const scrollers = Array.from(document.querySelectorAll<HTMLElement>('[data-testid="document-panel-scroller"]'))
  // The rightmost pane is the document being edited
  const el = scrollers[scrollers.length - 1]
  if (!el) return
  el.scrollTo({ top: to === 'top' ? 0 : el.scrollHeight, behavior: 'smooth' })
}

export function StudioLayoutWithScrollButtons(props: LayoutProps) {
  return (
    <>
      {props.renderDefault(props)}
      <Card
        radius={3}
        shadow={2}
        padding={1}
        style={{ position: 'fixed', right: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 100 }}
      >
        <Stack space={1}>
          <Button icon={ArrowUp} mode="bleed" title="Haut du document" onClick={() => scrollDocument('top')} />
          <Button icon={ArrowDown} mode="bleed" title="Bas du document" onClick={() => scrollDocument('bottom')} />
        </Stack>
      </Card>
    </>
  )
}
