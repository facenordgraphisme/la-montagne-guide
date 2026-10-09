import type { StructureResolver } from 'sanity/structure'
import { Home, UserRound, Mail, Settings, Compass, Layers, Mountain, BookOpen, Tag, LayoutTemplate, FileText } from 'lucide-react'

// A post counts as done if either its published or draft version is ticked
const PROGRESS_QUERY = `{
  "total": count(*[_type == "post" && !(_id in path("drafts.**"))]),
  "reviewed": count(array::unique(*[_type == "post" && reviewed == true]{"id": select(_id in path("drafts.**") => string::split(_id, "drafts.")[1], _id)}.id)),
  "images": count(array::unique(*[_type == "post" && imagesReviewed == true]{"id": select(_id in path("drafts.**") => string::split(_id, "drafts.")[1], _id)}.id))
}`

export const structure: StructureResolver = (S, context) =>
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

      // Navigation hiérarchique : Activité > Univers liés > Séjours liés
      S.listItem()
        .title('Activités')
        .icon(Compass)
        .child(
          S.documentTypeList('activity')
            .title('Activités')
            .child((activityId) =>
              S.list()
                .title('Activité')
                .items([
                  S.listItem()
                    .title("Modifier l'activité")
                    .icon(Compass)
                    .child(S.document().schemaType('activity').documentId(activityId)),
                  S.listItem()
                    .title('Univers liés')
                    .icon(Layers)
                    .child(
                      S.documentTypeList('univers')
                        .title('Univers')
                        .filter('_type == "univers" && activity._ref == $activityId')
                        .params({ activityId })
                        .child((universId) =>
                          S.list()
                            .title('Univers')
                            .items([
                              S.listItem()
                                .title("Modifier l'univers")
                                .icon(Layers)
                                .child(S.document().schemaType('univers').documentId(universId)),
                              S.listItem()
                                .title('Séjours liés')
                                .icon(Mountain)
                                .child(
                                  S.documentTypeList('sejour')
                                    .title('Séjours')
                                    .filter('_type == "sejour" && subCategory._ref == $universId')
                                    .params({ universId })
                                ),
                            ])
                        )
                    ),
                ])
            )
        ),

      S.divider(),

      // Accès direct à tous les séjours (filet de sécurité si subCategory non définie)
      S.listItem()
        .title('Catalogue des Séjours')
        .id('sejour-all')
        .icon(Mountain)
        .child(S.documentTypeList('sejour').title('Tous les séjours')),

      // Modèles d'onglets réutilisables
      S.listItem()
        .title("Modèles d'Onglets")
        .id('tabTemplate')
        .icon(LayoutTemplate)
        .child(S.documentTypeList('tabTemplate').title("Modèles d'Onglets")),

      S.divider(),

      // Ressources & Guides
      S.listItem()
        .title('Ressources & Guides')
        .icon(BookOpen)
        .child(
          S.list()
            .title('Ressources & Guides')
            .items([
              S.listItem()
                .title('Guides & Articles')
                .icon(BookOpen)
                .child(S.documentTypeList('resource').title('Guides & Articles')),
              S.listItem()
                .title('Catégories')
                .icon(Tag)
                .child(S.documentTypeList('resourceCategory').title('Catégories de ressources')),
            ])
        ),

      S.divider(),

      S.listItem()
        .title('Blog')
        .id('post')
        .icon(FileText)
        .child(async () => {
          const c = await context.getClient({ apiVersion: '2024-05-01' }).fetch(PROGRESS_QUERY)
          return S.documentTypeList('post').title(`Blog · ✅ ${c.reviewed}/${c.total} relus · 🖼️ ${c.images}/${c.total} images`)
        }),
      // Regular document types, filtered to exclude singletons and types already reachable via la navigation hiérarchique ci-dessus
      ...S.documentTypeListItems().filter(
        (listItem) => !['home', 'guide', 'contact', 'settings', 'activity', 'univers', 'sejour', 'tabTemplate', 'resource', 'resourceCategory', 'post'].includes(listItem.getId() || '')
      ),
    ])
