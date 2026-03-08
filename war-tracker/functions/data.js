// ─── CONFIGURATION ONLY ─────────────────────────────────────
// No hardcoded statistics. All data comes from live APIs.
// This file only contains editorial context and structure config.

module.exports = {
  // ─── Conflict metadata (editorial facts, not statistics) ──
  config: {
    conflictStart: '2025-06-13',
    phase2Start: '2026-02-28',
    operationNames: [
      'Operation Roaring Lion',
      'Operation Epic Fury',
      'Operation True Promise IV'
    ],
    // Search keywords for API queries
    searchKeywords: 'Iran Israel conflict war 2026',
    searchKeywordsHumanitarian: 'Iran humanitarian crisis 2026',
  },

  // ─── Tracked countries with metadata ──────────────────────
  countries: {
    iran:        { name: 'Iran',          flag: '🇮🇷', iso3: 'IRN', iso: 364, role: 'Defending' },
    israel:      { name: 'Israel',        flag: '🇮🇱', iso3: 'ISR', iso: 376, role: 'Attacker' },
    usa:         { name: 'United States', flag: '🇺🇸', iso3: 'USA', iso: 840, role: 'Attacker' },
    lebanon:     { name: 'Lebanon',       flag: '🇱🇧', iso3: 'LBN', iso: 422, role: 'Affected' },
    iraq:        { name: 'Iraq',          flag: '🇮🇶', iso3: 'IRQ', iso: 368, role: 'Affected' },
    qatar:       { name: 'Qatar',         flag: '🇶🇦', iso3: 'QAT', iso: 634, role: 'Affected' },
    bahrain:     { name: 'Bahrain',       flag: '🇧🇭', iso3: 'BHR', iso: 48,  role: 'Affected' },
    kuwait:      { name: 'Kuwait',        flag: '🇰🇼', iso3: 'KWT', iso: 414, role: 'Affected' },
    saudiarabia: { name: 'Saudi Arabia',  flag: '🇸🇦', iso3: 'SAU', iso: 682, role: 'Affected' },
    jordan:      { name: 'Jordan',        flag: '🇯🇴', iso3: 'JOR', iso: 400, role: 'Affected' },
    syria:       { name: 'Syria',         flag: '🇸🇾', iso3: 'SYR', iso: 760, role: 'Affected' },
  },

  // ─── Primary belligerents (for detailed country cards) ────
  primaryCountries: ['iran', 'israel', 'usa'],

  // ─── Regional countries (for regional impact section) ─────
  regionalCountries: ['lebanon', 'iraq', 'qatar', 'bahrain', 'kuwait', 'saudiarabia', 'jordan', 'syria'],

  // ─── Color coding rules ───────────────────────────────────
  colorRules: {
    fatalityThresholds: { red: 100, orange: 10, yellow: 1, muted: 0 },
    eventTypeColors: {
      'Battles': 'red',
      'Explosions/Remote violence': 'orange',
      'Violence against civilians': 'red',
      'Strategic developments': 'cyan',
      'Protests': 'yellow',
      'Riots': 'orange'
    }
  },

  // ─── Data sources attribution ─────────────────────────────
  sources: [
    'ACLED (Armed Conflict Location & Event Data)',
    'NewsAPI (Live)',
    'The Guardian (Live)',
    'GDELT Project',
    'ReliefWeb (UN OCHA)',
    'Alpha Vantage (Oil & Markets)',
    'Wikipedia',
    'UNHCR',
    'WHO',
    'MSF',
    'UNICEF',
    'Reuters / AP / AFP'
  ]
};
