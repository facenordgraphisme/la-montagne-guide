import { buildLegacyTheme } from 'sanity'

export const studioTheme = buildLegacyTheme({
  /* Brand Colors */
  '--brand-primary': '#06b6d4', // Turquoise glacial

  /* Base colors */
  '--black': '#0b1121', // Bleu marine très foncé (fond du site)
  '--white': '#f1f5f9', // Blanc bleuté pour le texte contrasté

  /* Gray */
  '--gray': '#64748b',
  '--gray-base': '#64748b',

  /* Component background and text */
  '--component-bg': '#0b1121',
  '--component-text-color': '#f1f5f9',

  /* Default buttons */
  '--default-button-color': '#1e293b',
  '--default-button-primary-color': '#06b6d4',

  /* Navigation */
  '--main-navigation-color': '#0b1121',
  '--main-navigation-color--inverted': '#f1f5f9',

  /* States */
  '--state-info-color': '#38bdf8', // Accent bleu azur
  '--state-success-color': '#10b981',
  '--state-warning-color': '#f59e0b',
  '--state-danger-color': '#ef4444',
})
