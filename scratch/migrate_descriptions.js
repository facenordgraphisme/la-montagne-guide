const { createClient } = require('next-sanity');

// Charger les variables .env localement si besoin
require('dotenv').config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'p72h34w4',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-05-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function stringToBlock(text) {
  if (!text) return [];
  return [
    {
      _type: 'block',
      _key: Math.random().toString(36).substring(2, 11),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: Math.random().toString(36).substring(2, 11),
          text: text,
          marks: [],
        },
      ],
    },
  ];
}

async function run() {
  console.log('Récupération des documents...');
  const query = `*[_type in ["activity", "sejour", "guide", "home", "settings"]]`;
  const docs = await client.fetch(query);
  console.log(`Trouvé ${docs.length} documents.`);

  for (const doc of docs) {
    const patches = {};
    let hasChanges = false;

    // Champs text/string à convertir en Portable Text
    const fieldsToConvert = [
      'description',
      'descriptionEn',
      'heroDescription',
      'heroDescriptionEn',
      'activitiesDescription',
      'activitiesDescriptionEn',
      'adventureDescription',
      'adventureDescriptionEn',
      'contactDescription',
      'contactDescriptionEn',
      'activitiesPageDescription',
      'activitiesPageDescriptionEn',
      'sortiesPageDescription',
      'sortiesPageDescriptionEn',
      'ressourcesPageDescription',
      'ressourcesPageDescriptionEn',
      'tarifsPageDescription',
      'tarifsPageDescriptionEn',
    ];

    for (const field of fieldsToConvert) {
      if (doc[field] && typeof doc[field] === 'string') {
        console.log(`Document ${doc._id} (${doc._type}) a une chaîne dans '${field}'. Conversion en bloc...`);
        patches[field] = stringToBlock(doc[field]);
        hasChanges = true;
      }
    }

    // Gestion du tableau des valeurs du Guide
    if (doc._type === 'guide' && Array.isArray(doc.valeurs)) {
      const newValeurs = doc.valeurs.map((val, idx) => {
        if (val.description && typeof val.description === 'string') {
          console.log(`Document ${doc._id} (guide) valeurs[${idx}] a une description en string. Conversion...`);
          hasChanges = true;
          return {
            ...val,
            description: stringToBlock(val.description),
          };
        }
        return val;
      });
      if (hasChanges) {
        patches.valeurs = newValeurs;
      }
    }

    if (hasChanges) {
      console.log(`Mise à jour du document ${doc._id}...`);
      await client.patch(doc._id).set(patches).commit();
      console.log(`Document ${doc._id} mis à jour avec succès.`);
    }
  }

  console.log('Migration terminée avec succès !');
}

run().catch(console.error);
