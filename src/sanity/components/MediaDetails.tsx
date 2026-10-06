import { useLayoutEffect, useRef, type ComponentProps, type ReactElement } from 'react'

type Props = { renderDefaultDetails: (props: any) => ReactElement } & Record<string, unknown>

// sanity-plugin-media hardcodes the "Description" label; the field is used as the photo caption on the site
function relabel(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.nodeValue === 'Description') n.nodeValue = 'Légende'
  }
}

export function MediaDetails(props: Props & ComponentProps<'div'>) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    relabel(el)
    const observer = new MutationObserver(() => relabel(el))
    observer.observe(el, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [])
  return <div ref={ref}>{props.renderDefaultDetails(props)}</div>
}
