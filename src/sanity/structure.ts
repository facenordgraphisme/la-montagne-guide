import type { StructureBuilder } from 'sanity/structure'
import { Home, UserRound, Mail, Settings } from 'lucide-react'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenu')
    .items([
      // Singletons
      S.listItem()
        .title('Paramètres Globaux')
        .id('settings')
        .icon(Settings)
        .child(S.document().schemaType('settings').documentId('settings').title('Paramètres Globaux')),

      S.divider(),

      S.listItem()
        .title('Page d\'accueil')
        .id('home')
        .icon(Home)
        .child(S.document().schemaType('home').documentId('home').title('Page d\'accueil')),
      
      S.listItem()
        .title('Le Guide')
        .id('guide')
        .icon(UserRound)
        .child(S.document().schemaType('guide').documentId('guide').title('Le Guide')),

      S.listItem()
        .title('Page Contact')
        .id('contact')
        .icon(Mail)
        .child(S.document().schemaType('contact').documentId('contact').title('Page Contact')),
      
      S.divider(),

      // Regular document types, filtered to exclude singletons
      ...S.documentTypeListItems().filter(
        (listItem) => !['home', 'guide', 'contact', 'settings'].includes(listItem.getId() || '')
      ),
    ])
