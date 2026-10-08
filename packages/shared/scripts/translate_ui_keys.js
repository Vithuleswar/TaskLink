/**
 * TaskLink Multilingual Translation Pipeline Script (PPT Requirement F4)
 * Generates translations for static UI strings across Bhashini Indic languages
 * Flags strings for human review per specification.
 */

const fs = require('fs');
const path = require('path');

const ENGLISH_KEYS = {
  app_title: 'TaskLink',
  app_tagline: 'Cooperative Gig-Services at 0% Commission',
  zero_commission_badge: '0% Platform Fee - 100% to Worker',
  search_placeholder: 'Search electrician, plumber, painter...',
  filter_service: 'Service',
  filter_rating: 'Min Rating',
  filter_distance: 'Distance',
  filter_language: 'Language',
  filter_available_now: 'Available Now',
  filter_crews_only: 'Crews / Groups Only',
  map_view: 'Map View',
  list_view: 'List View',
  book_now: 'Book Worker',
  pre_book_only: 'Pre-book only (Voice/Keypad)',
  verified_society: 'Verified Cooperative Member',
  digipin_label: 'DIGIPIN (Digital Postal Code)',
  digipin_placeholder: 'e.g. 78C-K2M-9Q2F',
  why_this_worker: 'Why this worker? (6-Factor Score)',
  night_premium_banner: 'Night window active (+25% premium directly to worker)',
  holiday_premium_banner: 'Cooperative holiday (+50% premium directly to worker)',
  how_tasklink_funded: 'How TaskLink is funded: Flat Cooperative Subscription',
};

const TARGET_LANGS = [
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mr', name: 'Marathi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'gu', name: 'Gujarati' },
];

async function runTranslationPipeline() {
  console.log('🌐 [Bhashini i18n Pipeline] Running static UI strings translation...');

  const outputDir = path.join(__dirname, '..', 'translations');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const lang of TARGET_LANGS) {
    const translationFile = path.join(outputDir, `${lang.code}.json`);
    const generated = {};

    for (const [key, text] of Object.entries(ENGLISH_KEYS)) {
      // In production calls Bhashini NMT API; here tags for human review
      generated[key] = {
        sourceText: text,
        translatedText: `[Bhashini-${lang.code}] ${text}`,
        status: 'needs_human_review',
        generatedAt: new Date().toISOString(),
      };
    }

    fs.writeFileSync(translationFile, JSON.stringify(generated, null, 2), 'utf8');
    console.log(`  ✓ Generated ${lang.name} (${lang.code}.json) with ${Object.keys(generated).length} keys [flagged: needs_human_review]`);
  }

  console.log('✅ [Bhashini i18n Pipeline] Complete. All target languages staged for review.');
}

runTranslationPipeline();
