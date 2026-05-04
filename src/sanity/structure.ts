import type { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenu')
    .items([
      // Singletons
      S.listItem()
        .title('Page d\'accueil')
        .id('home')
        .child(S.document().schemaType('home').documentId('home').title('Page d\'accueil')),
      
      S.listItem()
        .title('Le Guide')
        .id('guide')
        .child(S.document().schemaType('guide').documentId('guide').title('Le Guide')),

      S.listItem()
        .title('Page Contact')
        .id('contact')
        .child(S.document().schemaType('contact').documentId('contact').title('Page Contact')),
      
      S.divider(),

      // Regular document types, filtered to exclude singletons
      ...S.documentTypeListItems().filter(
        (listItem) => !['home', 'guide', 'contact'].includes(listItem.getId() || '')
      ),
    ])
