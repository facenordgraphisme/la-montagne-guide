export const metadata = {
  title: 'Sanity Studio',
  description: 'Administration du contenu',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
