# Graph Report - la-montagne-guide  (2026-11-05)

## Corpus Check
- 203 files · ~26,312,107 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 1, .csv 1, .ico 1)

## Summary
- 1080 nodes · 2300 edges · 98 communities (91 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `647fe6e3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- en/ressources/[slug]/page.tsx
- UpcomingSorties.tsx
- import-wordpress-posts.js
- lucide-react
- next-sanity
- getServerTranslations
- generate-seo.ts
- en/[activitySlug]/[subCategorySlug]/[slug]/page.tsx
- queries.ts
- sanity.config.ts
- next
- dependencies
- app/layout.tsx
- compilerOptions
- toPlainText
- BulkTagTool.tsx
- package.json
- translateDocument.tsx
- FAQPickerInput.tsx
- axios
- react
- cheerio
- app/page.tsx
- inspect-wp-divi.js
- post.tsx
- devDependencies
- inspect-missing-posts.js
- LanguageContext.tsx
- ContactForm.tsx
- ref_fs
- dump_content.js
- find_indices.js
- inspect_post.js
- csv-parse
- check-slug.js
- find-ubaye.js
- inspect-calanques.js
- inspect_galleries.js
- inspect-post-3.js
- inspect-vanoise-shortcodes.js
- migrate.js
- read-csv-post.js
- test_hybrid_parser.js
- test_resolution.js
- scripts
- ref_path
- check-csv.js
- check_image_urls.js
- check_mont_rose_shortcodes.js
- check_ponteil_csv_images.js
- check_row_keys.js
- check_ubaye_ids.js
- inspect-dates.js
- search_csv.js
- search-csv-image.js
- search_ponteil.js
- test_live_parsing.js
- cleanup-wp-posts.js
- live.ts
- ArticleImagesSource.tsx
- test-candidates.js
- ImageAssetSync.tsx
- migrate_tabs.js
- test-image-resolutions.js
- SejourPdf.tsx
- eslint.config.mjs
- inspect_live_captions.js
- test_id_fetch.js
- test-scrape.js
- useLanguage
- ResourcesListClient.tsx
- PostDetail.tsx
- Audit SEO complet : la-montagne-guide.fr
- studio/layout.tsx
- app/blog/page.tsx
- postcss.config.mjs
- Contenu à reprendre dans Sanity
- activites/[slug]/page.tsx
- app/contact/page.tsx
- Plan d'action SEO : la-montagne-guide.fr
- Agent-readiness - la-montagne-guide.fr (audit du 2026-11-04)
- Audit contenu / E-E-A-T : la-montagne-guide.fr
- High
- Medium
- SEO local - la-montagne-guide.fr (audit du 2026-11-04)
- Analyse SXO : la-montagne-guide.fr (04/11/2026)
- Audit GEO - la-montagne-guide.fr (4 novembre 2026)
- Audit visuel et mobile - la-montagne-guide.fr
- @portabletext/react
- Constats
- 4. SEO technique (40/100)
- 5. Contenu et E-E-A-T (58/100)
- README.md
- ImageGallery.tsx
- PartnersSlider.tsx
- AGENTS.md

## God Nodes (most connected - your core abstractions)
1. `react` - 65 edges
2. `next` - 59 edges
3. `getServerTranslations()` - 57 edges
4. `useLanguage()` - 53 edges
5. `lucide-react` - 52 edges
6. `LocaleLink()` - 33 edges
7. `csv-parse` - 26 edges
8. `sharedPageAlternates()` - 25 edges
9. `renderRichText()` - 24 edges
10. `toPlainText()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `Low` --references--> `ContactPage()`  [INFERRED]
  la-montagne-guide.fr-audit/findings/local.md → src/app/contact/page.tsx
- `H3. Entité Nicolas Draperi / La Montagne Guide non reliée dans le balisage.` --references--> `url()`  [INFERRED]
  la-montagne-guide.fr-audit/findings/geo.md → src/app/sitemap.ts
- `7. Schema (55/100)` --references--> `url()`  [INFERRED]
  la-montagne-guide.fr-audit/FULL-AUDIT-REPORT.md → src/app/sitemap.ts
- `sitemap()` --indirect_call--> `query()`  [INFERRED]
  src/app/sitemap.ts → scratch/migrate_tabs.js
- `UniversePage()` --calls--> `getServerTranslations()`  [EXTRACTED]
  src/app/[activitySlug]/[subCategorySlug]/page.tsx → src/i18n/server.ts

## Import Cycles
- None detected.

## Communities (98 total, 7 thin omitted)

### Community 0 - "en/ressources/[slug]/page.tsx"
Cohesion: 0.16
Nodes (19): EnResourceDetailPage(), makeBlockComponents(), generateMetadata(), makeBlockAlignComponents(), DEFAULT_FAQS, FAQAccordion(), FAQAccordionProps, FAQItem (+11 more)

### Community 1 - "UpcomingSorties.tsx"
Cohesion: 0.21
Nodes (13): CornerRibbon(), SpotsIndicator(), Sejour, Sortie, SortiesFilterableList(), SortiesFilterableListProps, toIsoDay(), Sejour (+5 more)

### Community 2 - "import-wordpress-posts.js"
Cohesion: 0.11
Nodes (35): args, axios, buildRowMediaMap(), CATEGORY_NAMES, cheerio, classifyTag(), client, { createClient } (+27 more)

### Community 3 - "lucide-react"
Cohesion: 0.12
Nodes (19): lucide-react, ref_sanity, activityType, descriptionBlocks, commentType, ctaType, faqType, faqCategoryType (+11 more)

### Community 4 - "next-sanity"
Cohesion: 0.10
Nodes (12): next-sanity, @react-pdf/renderer, client, { createClient }, run(), stringToBlock(), writeClient, GET (+4 more)

### Community 5 - "getServerTranslations"
Cohesion: 0.20
Nodes (12): ConfidentialitePage(), generateMetadata(), GuidePage(), generateMetadata(), MentionsLegalesPage(), generateMetadata(), SortiesPage(), dictionaries (+4 more)

### Community 6 - "generate-seo.ts"
Cohesion: 0.08
Nodes (26): ref_dotenv, ref_sanity_client, ref_sharp, client, { createClient }, args, buildAlt(), buildExcerpt() (+18 more)

### Community 7 - "en/[activitySlug]/[subCategorySlug]/[slug]/page.tsx"
Cohesion: 0.12
Nodes (28): react-dom, decodeSlug(), generateMetadata(), SejourDetail(), GET(), decodeSlug(), EnSejourDetail(), generateMetadata() (+20 more)

### Community 8 - "queries.ts"
Cohesion: 0.10
Nodes (26): activityBlockComponents, generateMetadata(), EnActivityOrPostPage(), generateMetadata(), Props, generateMetadata(), decodeSlug(), alternatesFor() (+18 more)

### Community 9 - "sanity.config.ts"
Cohesion: 0.10
Nodes (17): @sanity/locale-fr-fr, sanity-plugin-image-asset-picker, sanity-plugin-media, @sanity/vision, ApplyTagsToImagesAction(), CopyAltToCaptionAction(), DeleteTagEverywhereAction(), MediaDetails() (+9 more)

### Community 10 - "next"
Cohesion: 0.14
Nodes (3): nextConfig, next, config

### Community 11 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, axios, cheerio, clsx, csv-parse, @emailjs/browser, framer-motion, lucide-react (+13 more)

### Community 12 - "app/layout.tsx"
Cohesion: 0.11
Nodes (18): next-themes, src_app_globals, FONT_VARIABLES, generateMetadata(), inter, montserrat, outfit, playfairDisplay (+10 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 14 - "toPlainText"
Cohesion: 0.26
Nodes (11): ActivitesPage(), generateMetadata(), metadata, NotFound(), activities, ActivitySection(), ActivitySectionProps, activitiesQuery (+3 more)

### Community 15 - "BulkTagTool.tsx"
Cohesion: 0.20
Nodes (10): ref_sanity_ui, BulkTagTool(), PostDoc, randomKey(), TagDoc, key(), SyncArticleTagsToMedia(), run() (+2 more)

### Community 16 - "package.json"
Cohesion: 0.14
Nodes (13): name, private, version, @anthropic-ai/sdk, clsx, @sanity/image-url, tailwind-merge, tailwindcss (+5 more)

### Community 17 - "translateDocument.tsx"
Cohesion: 0.20
Nodes (14): applyImageTranslations(), applySpanTranslations(), batchTranslate(), extractImageFields(), extractSpans(), HAS_TABS, ImageFieldRef, imageRefs() (+6 more)

### Community 18 - "FAQPickerInput.tsx"
Cohesion: 0.15
Nodes (12): CategoryItem, FAQItem, FAQPickerInput(), isSelected(), toggleFaq(), generateKey(), contactType, descriptionBlocks (+4 more)

### Community 19 - "axios"
Cohesion: 0.15
Nodes (7): axios, axios, axios, axios, checkUrl(), run(), axios

### Community 20 - "react"
Cohesion: 0.16
Nodes (12): react, BlogTeaser(), BlogTeaserProps, Post, ContactHomeProps, HeroProps, LocaleLink(), Props (+4 more)

### Community 21 - "cheerio"
Cohesion: 0.17
Nodes (6): cheerio, axios, cheerio, cheerio, axios, cheerio

### Community 22 - "app/page.tsx"
Cohesion: 0.18
Nodes (12): PrestationDetail(), generateMetadata(), Home(), generateMetadata(), RessourcesPage(), AdventureProps, AdventureStart(), ContactHome() (+4 more)

### Community 23 - "inspect-wp-divi.js"
Cohesion: 0.18
Nodes (9): csvPath, fileContent, fs, p1, p2, p3, { parse }, path (+1 more)

### Community 24 - "post.tsx"
Cohesion: 0.18
Nodes (13): FilterMode, GalleryPickerInput(), generateKey(), TagImagePickerInput(), handleClick(), isSelected(), PostMediaManagerInput(), postType (+5 more)

### Community 25 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, @anthropic-ai/sdk, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+2 more)

### Community 26 - "inspect-missing-posts.js"
Cohesion: 0.20
Nodes (9): csvPath, fileContent, fs, p1, p2, p3, { parse }, path (+1 more)

### Community 27 - "LanguageContext.tsx"
Cohesion: 0.19
Nodes (13): dictionaries, Language, LanguageContext, LanguageContextType, LanguageProvider(), normalize(), normalizedDictionary, src_i18n_dictionaries_en (+5 more)

### Community 28 - "ContactForm.tsx"
Cohesion: 0.40
Nodes (3): @emailjs/browser, ContactForm(), Status

### Community 29 - "ref_fs"
Cohesion: 0.28
Nodes (8): ref_fs, client, disciplineOf(), dry, norm(), physicalNumbers, [step], technicalNumber()

### Community 30 - "dump_content.js"
Cohesion: 0.22
Nodes (8): csvPath, fileContent, fs, { parse }, path, post1, post2, records

### Community 31 - "find_indices.js"
Cohesion: 0.22
Nodes (8): csvPath, fileContent, fs, idx1, idx2, { parse }, path, records

### Community 32 - "inspect_post.js"
Cohesion: 0.22
Nodes (8): csvPath, fileContent, fs, index, { parse }, path, post, records

### Community 33 - "csv-parse"
Cohesion: 0.25
Nodes (7): csv-parse, csvPath, fileContent, fs, { parse }, path, records

### Community 34 - "check-slug.js"
Cohesion: 0.25
Nodes (7): csvPath, fileContent, fs, { parse }, path, records, slugKey

### Community 35 - "find-ubaye.js"
Cohesion: 0.25
Nodes (7): csvPath, fileContent, fs, matches, { parse }, path, records

### Community 36 - "inspect-calanques.js"
Cohesion: 0.25
Nodes (7): csvPath, fileContent, fs, { parse }, path, post, records

### Community 37 - "inspect_galleries.js"
Cohesion: 0.29
Nodes (7): axios, cheerio, fs, { parse }, path, run(), testPost()

### Community 38 - "inspect-post-3.js"
Cohesion: 0.25
Nodes (7): csvPath, fileContent, fs, { parse }, path, post, records

### Community 39 - "inspect-vanoise-shortcodes.js"
Cohesion: 0.25
Nodes (7): csvPath, fileContent, fs, p3, { parse }, path, records

### Community 40 - "migrate.js"
Cohesion: 0.25
Nodes (6): axios, env, envContent, envPath, fs, path

### Community 41 - "read-csv-post.js"
Cohesion: 0.25
Nodes (7): csvPath, fileContent, fs, { parse }, path, post, records

### Community 42 - "test_hybrid_parser.js"
Cohesion: 0.36
Nodes (7): axios, cheerio, generateKey(), getCandidates(), parseLivePageToPortableText(), path, run()

### Community 43 - "test_resolution.js"
Cohesion: 0.36
Nodes (7): axios, cheerio, getActualWordPressSlug(), path, run(), slugify(), test()

### Community 44 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, seo, seo:write, start

### Community 45 - "ref_path"
Cohesion: 0.33
Nodes (6): ref_path, axios, cheerio, getCandidates(), path, run()

### Community 46 - "check-csv.js"
Cohesion: 0.29
Nodes (6): csvPath, fileContent, fs, { parse }, path, records

### Community 47 - "check_image_urls.js"
Cohesion: 0.29
Nodes (6): csvPath, fileContent, fs, { parse }, path, records

### Community 48 - "check_mont_rose_shortcodes.js"
Cohesion: 0.29
Nodes (6): csvPath, fileContent, fs, { parse }, path, records

### Community 49 - "check_ponteil_csv_images.js"
Cohesion: 0.29
Nodes (6): csvPath, fileContent, fs, { parse }, path, records

### Community 50 - "check_row_keys.js"
Cohesion: 0.29
Nodes (6): csvPath, fileContent, fs, { parse }, path, records

### Community 51 - "check_ubaye_ids.js"
Cohesion: 0.29
Nodes (6): csvPath, fileContent, fs, { parse }, path, records

### Community 52 - "inspect-dates.js"
Cohesion: 0.29
Nodes (6): csvPath, fileContent, fs, { parse }, path, records

### Community 53 - "search_csv.js"
Cohesion: 0.29
Nodes (6): csvPath, fileContent, fs, { parse }, path, records

### Community 54 - "search-csv-image.js"
Cohesion: 0.29
Nodes (6): csvPath, fileContent, fs, { parse }, path, records

### Community 55 - "search_ponteil.js"
Cohesion: 0.29
Nodes (6): csvPath, fileContent, fs, { parse }, path, records

### Community 56 - "test_live_parsing.js"
Cohesion: 0.38
Nodes (6): axios, cheerio, getCandidates(), path, run(), testLiveParsing()

### Community 57 - "cleanup-wp-posts.js"
Cohesion: 0.29
Nodes (5): client, { createClient }, fs, { parse }, path

### Community 58 - "live.ts"
Cohesion: 0.14
Nodes (15): blockAlignComponents, blocksToText(), generateMetadata(), UniversePage(), blockAlignComponents, generateMetadata(), generateMetadata(), SortieDetailPage() (+7 more)

### Community 59 - "ArticleImagesSource.tsx"
Cohesion: 0.33
Nodes (6): ArticleImagesDialog(), articleImagesSource, Asset, Doc, slugOf(), TYPE_LABEL

### Community 60 - "test-candidates.js"
Cohesion: 0.47
Nodes (5): axios, checkUrl(), getCandidates(), path, run()

### Community 61 - "ImageAssetSync.tsx"
Cohesion: 0.40
Nodes (3): FIELD_TO_ASSET, ImageAssetSyncInput(), isImageType()

### Community 62 - "migrate_tabs.js"
Cohesion: 0.18
Nodes (13): ref_crypto, axios, crypto, env, envPath, fs, key(), mutate() (+5 more)

### Community 63 - "test-image-resolutions.js"
Cohesion: 0.50
Nodes (3): axios, checkUrl(), run()

### Community 64 - "SejourPdf.tsx"
Cohesion: 0.24
Nodes (12): align(), clean(), fontFor(), isEmptyBlock(), PdfNode, PdfSejour, richNodes(), RichText() (+4 more)

### Community 65 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 67 - "test_id_fetch.js"
Cohesion: 0.67
Nodes (3): axios, run(), test()

### Community 69 - "useLanguage"
Cohesion: 0.11
Nodes (19): framer-motion, AboutProps, AboutSection(), blockAlignComponents, AnnouncementBanner(), AnnouncementBannerProps, Comment, PostComments() (+11 more)

### Community 70 - "ResourcesListClient.tsx"
Cohesion: 0.18
Nodes (8): FALLBACK_CATEGORIES, Resource, ResourcesListClient(), ResourcesListClientProps, SanityCategory, BlogFilters(), BlogFiltersProps, FilterTag

### Community 71 - "PostDetail.tsx"
Cohesion: 0.31
Nodes (10): GenericRootPage(), makeBlogBlockComponents(), BlogCard(), BlogCardProps, makeBlogBlockComponents(), PostDetail(), Props, getVanityImageUrl() (+2 more)

### Community 72 - "Audit SEO complet : la-montagne-guide.fr"
Cohesion: 0.18
Nodes (11): 10. Recherche IA (51/100), 11. Local et expérience (score local indicatif : 38/100), 1. Synthèse, 2. Périmètre et limites, 3. Trafic et visibilité (Search Console), 6. SEO on-page (55/100), 8. Performance (68/100), 9. Images (72/100) (+3 more)

### Community 74 - "app/blog/page.tsx"
Cohesion: 0.28
Nodes (6): BlogPage(), BlogPageProps, generateMetadata(), Pagination(), PaginationProps, settingsQuery

### Community 76 - "Contenu à reprendre dans Sanity"
Cohesion: 0.25
Nodes (7): 1. À corriger en priorité, 2. Adresses anglaises partagées par plusieurs articles, 3. Titres anglais traduits automatiquement (49 articles), 4. Articles avec une adresse anglaise mais sans texte anglais (3), 5. Pages à compléter, 6. Redirections à valider, Contenu à reprendre dans Sanity

### Community 77 - "activites/[slug]/page.tsx"
Cohesion: 0.29
Nodes (5): blockAlignComponents, prestationsFallback, Faq, FaqJsonLd(), activityBySlugQuery

### Community 78 - "app/contact/page.tsx"
Cohesion: 0.32
Nodes (5): ContactPage(), generateMetadata(), ObfuscatedContact(), ObfuscatedContactProps, contactQuery

### Community 79 - "Plan d'action SEO : la-montagne-guide.fr"
Cohesion: 0.29
Nodes (6): Critique : cette semaine, Faible : au fil de l'eau, Moyen : mois 2, Plan d'action SEO : la-montagne-guide.fr, Suivi, Élevé : semaines 2 et 3

### Community 80 - "Agent-readiness - la-montagne-guide.fr (audit du 2026-11-04)"
Cohesion: 0.29
Nodes (7): Agent-readiness - la-montagne-guide.fr (audit du 2026-11-04), Critical, High, Lighthouse Agentic Browsing (v13.6.0, PSI), Low, Medium, Politique d'acces

### Community 81 - "Audit contenu / E-E-A-T : la-montagne-guide.fr"
Cohesion: 0.29
Nodes (7): Audit contenu / E-E-A-T : la-montagne-guide.fr, Critical, High, Low, Medium, Points forts (à préserver), Score : 58/100 (modèle interne de cet audit, jugement qualitatif et non une mesure Google)

### Community 82 - "High"
Cohesion: 0.29
Nodes (7): H1. FAQ et onglets de séjour absents du DOM initial., H2. /le-guide n'offre aucun passage factuel extractible sur le guide., H3. Entité Nicolas Draperi / La Montagne Guide non reliée dans le balisage., H4. /alpinisme/initiation-alpinisme trop mince pour répondre aux questions de débutant., High, 7. Schema (55/100), url()

### Community 83 - "Medium"
Cohesion: 0.29
Nodes (7): M1. Mentions externes réelles mais modestes et mal capitalisées., M2. Version anglaise incohérente pour une lecture par entité., M3. Séjour Queyras : très bonne matière, mal synthétisée., M4. Contenus durables rares et non balisés., M5. /tour-germaine : récit authentique mais peu réutilisable., M6. /tarifs figure au sitemap mais renvoie 404., Medium

### Community 84 - "SEO local - la-montagne-guide.fr (audit du 2026-11-04)"
Cohesion: 0.29
Nodes (6): Critical, High, Low, Medium, Non vérifié, SEO local - la-montagne-guide.fr (audit du 2026-11-04)

### Community 85 - "Analyse SXO : la-montagne-guide.fr (04/11/2026)"
Cohesion: 0.29
Nodes (7): Analyse SXO : la-montagne-guide.fr (04/11/2026), Fiabilité des SERP : à lire avant les constats, Limites, Personas (dérivés des types de résultats, faute de PAA ; notes /25), Plan d'action, SXO Gap Score : 51/100 (distinct du SEO Health Score, note d'expert indicative), Écarts de type de page

### Community 86 - "Audit GEO - la-montagne-guide.fr (4 novembre 2026)"
Cohesion: 0.33
Nodes (5): Audit GEO - la-montagne-guide.fr (4 novembre 2026), Critical, Limites, Low, Score de préparation GEO : 51/100 (estimation d'audit, pas une mesure de citations)

### Community 87 - "Audit visuel et mobile - la-montagne-guide.fr"
Cohesion: 0.33
Nodes (5): Audit visuel et mobile - la-montagne-guide.fr, Critical, High, Low, Medium

### Community 88 - "@portabletext/react"
Cohesion: 0.33
Nodes (4): @portabletext/react, portableTextComponents, RichContent(), RichContentProps

### Community 89 - "Constats"
Cohesion: 0.40
Nodes (5): Constats, Critical, High, Low, Medium

### Community 90 - "4. SEO technique (40/100)"
Cohesion: 0.40
Nodes (5): 4. SEO technique (40/100), Critique, Faible, Moyen, Élevé

### Community 92 - "5. Contenu et E-E-A-T (58/100)"
Cohesion: 0.50
Nodes (4): 5. Contenu et E-E-A-T (58/100), Critique (métier), Moyen et faible, Élevé

### Community 93 - "README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 94 - "ImageGallery.tsx"
Cohesion: 0.50
Nodes (3): GalleryImage, ImageGallery(), ImageGalleryProps

### Community 95 - "PartnersSlider.tsx"
Cohesion: 0.50
Nodes (3): FALLBACK_PARTNERS, Partner, PartnersSliderProps

## Knowledge Gaps
- **491 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+486 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 542 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `csv-parse` connect `csv-parse` to `import-wordpress-posts.js`, `package.json`, `inspect-wp-divi.js`, `inspect-missing-posts.js`, `dump_content.js`, `find_indices.js`, `inspect_post.js`, `check-slug.js`, `find-ubaye.js`, `inspect-calanques.js`, `inspect_galleries.js`, `inspect-post-3.js`, `inspect-vanoise-shortcodes.js`, `read-csv-post.js`, `check-csv.js`, `check_image_urls.js`, `check_mont_rose_shortcodes.js`, `check_ponteil_csv_images.js`, `check_row_keys.js`, `check_ubaye_ids.js`, `inspect-dates.js`, `search_csv.js`, `search-csv-image.js`, `search_ponteil.js`, `cleanup-wp-posts.js`?**
  _High betweenness centrality (0.270) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `en/ressources/[slug]/page.tsx`, `UpcomingSorties.tsx`, `next-sanity`, `getServerTranslations`, `en/[activitySlug]/[subCategorySlug]/[slug]/page.tsx`, `queries.ts`, `app/layout.tsx`, `toPlainText`, `package.json`, `react`, `app/page.tsx`, `LanguageContext.tsx`, `live.ts`, `useLanguage`, `ResourcesListClient.tsx`, `PostDetail.tsx`, `app/blog/page.tsx`, `activites/[slug]/page.tsx`, `app/contact/page.tsx`, `@portabletext/react`, `ImageGallery.tsx`, `PartnersSlider.tsx`?**
  _High betweenness centrality (0.203) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `en/ressources/[slug]/page.tsx`, `UpcomingSorties.tsx`, `lucide-react`, `getServerTranslations`, `en/[activitySlug]/[subCategorySlug]/[slug]/page.tsx`, `queries.ts`, `sanity.config.ts`, `app/layout.tsx`, `toPlainText`, `BulkTagTool.tsx`, `package.json`, `translateDocument.tsx`, `FAQPickerInput.tsx`, `app/page.tsx`, `post.tsx`, `LanguageContext.tsx`, `ContactForm.tsx`, `live.ts`, `ArticleImagesSource.tsx`, `ImageAssetSync.tsx`, `SejourPdf.tsx`, `useLanguage`, `ResourcesListClient.tsx`, `activites/[slug]/page.tsx`, `app/contact/page.tsx`, `ImageGallery.tsx`, `PartnersSlider.tsx`?**
  _High betweenness centrality (0.202) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _491 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `import-wordpress-posts.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10793650793650794 - nodes in this community are weakly interconnected._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.12299465240641712 - nodes in this community are weakly interconnected._
- **Should `next-sanity` be split into smaller, more focused modules?**
  _Cohesion score 0.10333333333333333 - nodes in this community are weakly interconnected._