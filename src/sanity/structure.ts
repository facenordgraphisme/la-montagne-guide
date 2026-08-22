import type { StructureBuilder } from 'sanity/structure'
import { Home, UserRound, Mail, Settings, Compass, Layers, Mountain } from 'lucide-react'

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

      // Regular document types, filtered to exclude singletons and types already reachable via la navigation hiérarchique ci-dessus
      ...S.documentTypeListItems().filter(
        (listItem) => !['home', 'guide', 'contact', 'settings', 'activity', 'univers', 'sejour'].includes(listItem.getId() || '')
      ),
    ])
