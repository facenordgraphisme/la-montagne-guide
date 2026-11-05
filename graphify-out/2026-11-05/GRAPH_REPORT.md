# Graph Report - la-montagne-guide  (2026-10-30)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 955 nodes · 2025 edges · 76 communities (70 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `647fe6e3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- useLanguage
- SejourPdf.tsx
- import-wordpress-posts.js
- lucide-react
- migrate_tabs.js
- getServerTranslations
- generate-seo.ts
- en/[activitySlug]/[subCategorySlug]/[slug]/page.tsx
- queries.ts
- react
- next
- dependencies
- app/layout.tsx
- compilerOptions
- app/page.tsx
- BulkTagTool.tsx
- package.json
- translateDocument.tsx
- FAQPickerInput.tsx
- axios
- levels.ts
- cheerio
- renderRichText
- inspect-wp-divi.js
- post.tsx
- devDependencies
- inspect-missing-posts.js
- LanguageContext.tsx
- framer-motion
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
- [subCategorySlug]/page.tsx
- ArticleImagesSource.tsx
- test-candidates.js
- ImageAssetSync.tsx
- Navbar.tsx
- test-image-resolutions.js
- prochaines-sorties/[slug]/page.tsx
- eslint.config.mjs
- inspect_live_captions.js
- test_id_fetch.js
- test-scrape.js
- AboutSection.tsx
- BlogFilters.tsx
- Testimonials.tsx
- middleware.ts
- studio/layout.tsx
- AnnouncementBanner.tsx
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `react` - 64 edges
2. `next` - 61 edges
3. `getServerTranslations()` - 57 edges
4. `useLanguage()` - 53 edges
5. `lucide-react` - 52 edges
6. `csv-parse` - 26 edges
7. `renderRichText()` - 24 edges
8. `toPlainText()` - 21 edges
9. `autoFill()` - 20 edges
10. `client` - 20 edges

## Surprising Connections (you probably didn't know these)
- `sitemap()` --indirect_call--> `query()`  [INFERRED]
  src/app/sitemap.ts → scratch/migrate_tabs.js
- `generateMetadata()` --calls--> `getServerTranslations()`  [EXTRACTED]
  src/app/le-guide/page.tsx → src/i18n/server.ts
- `PrestationContent()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/PrestationContent.tsx → src/context/LanguageContext.tsx
- `ContactPage()` --calls--> `getServerTranslations()`  [EXTRACTED]
  src/app/contact/page.tsx → src/i18n/server.ts
- `generateMetadata()` --calls--> `getServerTranslations()`  [EXTRACTED]
  src/app/contact/page.tsx → src/i18n/server.ts

## Import Cycles
- None detected.

## Communities (76 total, 6 thin omitted)

### Community 0 - "useLanguage"
Cohesion: 0.05
Nodes (65): @portabletext/react, activityBlockComponents, GenericRootPage(), makeBlogBlockComponents(), GET(), EnResourceDetailPage(), makeBlockComponents(), blockAlignComponents (+57 more)

### Community 1 - "SejourPdf.tsx"
Cohesion: 0.09
Nodes (31): blockAlignComponents, PrestationContent(), PrestationContentProps, CornerRibbon(), SpotsIndicator(), Sejour, Sortie, SortiesFilterableList() (+23 more)

### Community 2 - "import-wordpress-posts.js"
Cohesion: 0.11
Nodes (35): args, axios, buildRowMediaMap(), CATEGORY_NAMES, cheerio, classifyTag(), client, { createClient } (+27 more)

### Community 3 - "lucide-react"
Cohesion: 0.12
Nodes (20): lucide-react, ref_sanity, resolve, activityType, descriptionBlocks, commentType, contactType, ctaType (+12 more)

### Community 4 - "migrate_tabs.js"
Cohesion: 0.08
Nodes (23): ref_crypto, next-sanity, client, { createClient }, run(), stringToBlock(), axios, crypto (+15 more)

### Community 5 - "getServerTranslations"
Cohesion: 0.11
Nodes (26): generateMetadata(), generateMetadata(), ConfidentialitePage(), generateMetadata(), generateMetadata(), MentionsLegalesPage(), generateMetadata(), SortiesPage() (+18 more)

### Community 6 - "generate-seo.ts"
Cohesion: 0.08
Nodes (26): ref_dotenv, ref_sanity_client, ref_sharp, client, { createClient }, args, buildAlt(), buildExcerpt() (+18 more)

### Community 7 - "en/[activitySlug]/[subCategorySlug]/[slug]/page.tsx"
Cohesion: 0.11
Nodes (19): react-dom, decodeSlug(), generateMetadata(), SejourDetail(), decodeSlug(), EnSejourDetail(), generateMetadata(), BookingButton() (+11 more)

### Community 8 - "queries.ts"
Cohesion: 0.10
Nodes (19): writeClient, BlogPage(), BlogPageProps, generateMetadata(), EnPostPage(), Pagination(), PaginationProps, prefersFrench() (+11 more)

### Community 9 - "react"
Cohesion: 0.11
Nodes (14): react, @sanity/locale-fr-fr, sanity-plugin-image-asset-picker, sanity-plugin-media, ApplyTagsToImagesAction(), CopyAltToCaptionAction(), DeleteTagEverywhereAction(), MediaDetails() (+6 more)

### Community 10 - "next"
Cohesion: 0.11
Nodes (10): nextConfig, next, ContactPage(), generateMetadata(), ContactHome(), ContactHomeProps, FooterProps, ObfuscatedContact() (+2 more)

### Community 11 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, axios, cheerio, clsx, csv-parse, @emailjs/browser, framer-motion, lucide-react (+13 more)

### Community 12 - "app/layout.tsx"
Cohesion: 0.12
Nodes (14): src_app_globals, FONT_VARIABLES, inter, montserrat, outfit, playfairDisplay, poppins, RootLayout() (+6 more)

### Community 13 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 14 - "app/page.tsx"
Cohesion: 0.20
Nodes (12): ActivitesPage(), metadata, NotFound(), Home(), client, previewClient, STEGA_EXCLUDED, activitiesQuery (+4 more)

### Community 15 - "BulkTagTool.tsx"
Cohesion: 0.16
Nodes (12): ref_sanity_ui, BulkTagTool(), PostDoc, randomKey(), TagDoc, scrollDocument(), StudioLayoutWithScrollButtons(), key() (+4 more)

### Community 16 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, @anthropic-ai/sdk, clsx, @react-pdf/renderer, @sanity/image-url, @sanity/vision (+7 more)

### Community 17 - "translateDocument.tsx"
Cohesion: 0.20
Nodes (14): applyImageTranslations(), applySpanTranslations(), batchTranslate(), extractImageFields(), extractSpans(), HAS_TABS, ImageFieldRef, imageRefs() (+6 more)

### Community 18 - "FAQPickerInput.tsx"
Cohesion: 0.17
Nodes (11): CategoryItem, FAQItem, FAQPickerInput(), isSelected(), toggleFaq(), generateKey(), descriptionBlocks, homeType (+3 more)

### Community 19 - "axios"
Cohesion: 0.15
Nodes (7): axios, axios, axios, axios, checkUrl(), run(), axios

### Community 20 - "levels.ts"
Cohesion: 0.19
Nodes (11): panelComponents, SejourLevel, SejourLevels(), descriptionBlocks, sejourType, findLevelIcon(), LEVEL_DISCIPLINES, LEVEL_NUMBERS (+3 more)

### Community 21 - "cheerio"
Cohesion: 0.17
Nodes (6): cheerio, axios, cheerio, cheerio, axios, cheerio

### Community 22 - "renderRichText"
Cohesion: 0.21
Nodes (8): blockAlignComponents, PrestationDetail(), prestationsFallback, AdventureProps, AdventureStart(), Hero(), HeroProps, renderRichText()

### Community 23 - "inspect-wp-divi.js"
Cohesion: 0.18
Nodes (9): csvPath, fileContent, fs, p1, p2, p3, { parse }, path (+1 more)

### Community 24 - "post.tsx"
Cohesion: 0.27
Nodes (9): FilterMode, GalleryPickerInput(), generateKey(), TagImagePickerInput(), handleClick(), isSelected(), PostMediaManagerInput(), postType (+1 more)

### Community 25 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, @anthropic-ai/sdk, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+2 more)

### Community 26 - "inspect-missing-posts.js"
Cohesion: 0.20
Nodes (9): csvPath, fileContent, fs, p1, p2, p3, { parse }, path (+1 more)

### Community 27 - "LanguageContext.tsx"
Cohesion: 0.24
Nodes (8): dictionaries, Language, LanguageContext, LanguageContextType, LanguageProvider(), normalize(), normalizedDictionary, sanityTranslations

### Community 28 - "framer-motion"
Cohesion: 0.22
Nodes (6): @emailjs/browser, framer-motion, ContactForm(), Status, WhatsAppButton(), WhatsAppButtonProps

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

### Community 58 - "[subCategorySlug]/page.tsx"
Cohesion: 0.33
Nodes (6): blockAlignComponents, blocksToText(), generateMetadata(), UniversePage(), activityBySlugQuery, sejoursByActivityQuery

### Community 59 - "ArticleImagesSource.tsx"
Cohesion: 0.33
Nodes (6): ArticleImagesDialog(), articleImagesSource, Asset, Doc, slugOf(), TYPE_LABEL

### Community 60 - "test-candidates.js"
Cohesion: 0.47
Nodes (5): axios, checkUrl(), getCandidates(), path, run()

### Community 61 - "ImageAssetSync.tsx"
Cohesion: 0.40
Nodes (3): FIELD_TO_ASSET, ImageAssetSyncInput(), isImageType()

### Community 62 - "Navbar.tsx"
Cohesion: 0.40
Nodes (3): next-themes, Navbar(), ThemeProvider()

### Community 63 - "test-image-resolutions.js"
Cohesion: 0.50
Nodes (3): axios, checkUrl(), run()

### Community 64 - "prochaines-sorties/[slug]/page.tsx"
Cohesion: 0.40
Nodes (4): generateMetadata(), SortieDetailPage(), SortiePageProps, sortieBySlugQuery

### Community 65 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 67 - "test_id_fetch.js"
Cohesion: 0.67
Nodes (3): axios, run(), test()

### Community 69 - "AboutSection.tsx"
Cohesion: 0.50
Nodes (3): AboutProps, AboutSection(), blockAlignComponents

### Community 70 - "BlogFilters.tsx"
Cohesion: 0.50
Nodes (3): BlogFilters(), BlogFiltersProps, FilterTag

### Community 71 - "Testimonials.tsx"
Cohesion: 0.50
Nodes (3): Testimonial, Testimonials(), TestimonialsProps

## Knowledge Gaps
- **415 isolated node(s):** `Resource`, `ResourcesListClientProps`, `SanityCategory`, `BlogCardProps`, `BlogTeaserProps` (+410 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 466 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `csv-parse` connect `csv-parse` to `import-wordpress-posts.js`, `package.json`, `inspect-wp-divi.js`, `inspect-missing-posts.js`, `dump_content.js`, `find_indices.js`, `inspect_post.js`, `check-slug.js`, `find-ubaye.js`, `inspect-calanques.js`, `inspect_galleries.js`, `inspect-post-3.js`, `inspect-vanoise-shortcodes.js`, `read-csv-post.js`, `check-csv.js`, `check_image_urls.js`, `check_mont_rose_shortcodes.js`, `check_ponteil_csv_images.js`, `check_row_keys.js`, `check_ubaye_ids.js`, `inspect-dates.js`, `search_csv.js`, `search-csv-image.js`, `search_ponteil.js`, `cleanup-wp-posts.js`?**
  _High betweenness centrality (0.296) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `useLanguage`, `SejourPdf.tsx`, `getServerTranslations`, `en/[activitySlug]/[subCategorySlug]/[slug]/page.tsx`, `next`, `app/layout.tsx`, `app/page.tsx`, `BulkTagTool.tsx`, `package.json`, `translateDocument.tsx`, `FAQPickerInput.tsx`, `levels.ts`, `renderRichText`, `post.tsx`, `LanguageContext.tsx`, `framer-motion`, `[subCategorySlug]/page.tsx`, `ArticleImagesSource.tsx`, `ImageAssetSync.tsx`, `Navbar.tsx`, `prochaines-sorties/[slug]/page.tsx`, `AboutSection.tsx`, `BlogFilters.tsx`, `Testimonials.tsx`, `AnnouncementBanner.tsx`?**
  _High betweenness centrality (0.207) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `useLanguage`, `SejourPdf.tsx`, `migrate_tabs.js`, `getServerTranslations`, `en/[activitySlug]/[subCategorySlug]/[slug]/page.tsx`, `queries.ts`, `app/layout.tsx`, `app/page.tsx`, `package.json`, `renderRichText`, `LanguageContext.tsx`, `framer-motion`, `[subCategorySlug]/page.tsx`, `Navbar.tsx`, `prochaines-sorties/[slug]/page.tsx`, `AboutSection.tsx`, `BlogFilters.tsx`, `middleware.ts`, `AnnouncementBanner.tsx`?**
  _High betweenness centrality (0.164) - this node is a cross-community bridge._
- **What connects `Resource`, `ResourcesListClientProps`, `SanityCategory` to the rest of the system?**
  _415 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useLanguage` be split into smaller, more focused modules?**
  _Cohesion score 0.054431960049937576 - nodes in this community are weakly interconnected._
- **Should `SejourPdf.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09176788124156546 - nodes in this community are weakly interconnected._
- **Should `import-wordpress-posts.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10793650793650794 - nodes in this community are weakly interconnected._