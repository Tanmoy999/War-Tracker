// Real-time statistics data store
// This file contains the actual data values that get merged with live news

module.exports = {
  lastUpdated: new Date().toISOString(),
  meta: {
    conflictStart: "2025-06-13",
    phase2Start: "2026-02-28",
    currentDay: 6,
    operationNames: ["Operation Roaring Lion", "Operation Epic Fury", "Operation True Promise IV"],
  },
  globalStats: [
    {
      id: "total_deaths",
      label: "Total Deaths — All Sides",
      value: "2,400+",
      rawValue: 2400,
      sub: "Verified by Hengaw & multiple agencies",
      source: "As of March 7, 2026 (Live)",
      color: "red"
    },
    {
      id: "iran_deaths",
      label: "Deaths in Iran",
      value: "2,090+",
      rawValue: 2090,
      sub: "~310 civilians (13%) · ~1,780 military",
      source: "Source: Hengaw Organization for Human Rights (Live)",
      color: "orange"
    },
    {
      id: "israel_deaths",
      label: "Deaths in Israel",
      value: "28",
      rawValue: 28,
      sub: "~3,238 wounded · 9 killed in single Beit Shemesh strike",
      source: "Source: Israeli MoH / Al Jazeera (Live)",
      color: "yellow"
    },
    {
      id: "us_deaths",
      label: "US Soldiers Killed",
      value: "6",
      rawValue: 6,
      sub: "2 bodies recovered from regional facility",
      source: "Source: CENTCOM confirmed (Live)",
      color: "cyan"
    },
    {
      id: "gulf_deaths",
      label: "Gulf States Killed",
      value: "9+",
      rawValue: 9,
      sub: "Kuwait · Bahrain · Qatar",
      source: "CNN · Al Jazeera (Live)",
      color: "muted"
    },
    {
      id: "lebanon_deaths",
      label: "Lebanon Deaths",
      value: "50+",
      rawValue: 50,
      sub: "335+ wounded from Israeli air strikes",
      source: "Lebanese Health Ministry (Live)",
      color: "orange"
    }
  ],
  countries: {
    iran: {
      name: "Iran",
      flag: "🇮🇷",
      role: "Defending",
      stats: [
        { key: "Civilian deaths", value: "310+", color: "red" },
        { key: "Military deaths", value: "2,090+", color: "red" },
        { key: "Provinces struck", value: "24 of 31", color: "orange" },
        { key: "Cities targeted", value: "163", color: "orange" },
        { key: "Missiles sent to Israel", value: "550+ ballistic", color: "cyan" },
        { key: "Drones launched", value: "1,000+", color: "cyan" },
        { key: "Bases engaged (region)", value: "27 US bases", color: "orange" },
        { key: "Supreme Leader", value: "Khamenei — Killed", color: "red" }
      ]
    },
    israel: {
      name: "Israel",
      flag: "🇮🇱",
      role: "Attacker",
      stats: [
        { key: "Civilian deaths", value: "28", color: "red" },
        { key: "Wounded", value: "3,238+", color: "orange" },
        { key: "Munitions dropped on Iran", value: "1,200+", color: "cyan" },
        { key: "Provinces struck in Iran", value: "24", color: "cyan" },
        { key: "Reservists called up", value: "70,000", color: "orange" },
        { key: "Iran senior officials killed", value: "8+", color: "red" },
        { key: "Attack waves on Iran", value: "10+", color: "cyan" },
        { key: "Operation name", value: "Roaring Lion", color: "normal" }
      ]
    },
    usa: {
      name: "USA",
      flag: "🇺🇸",
      role: "Attacker",
      stats: [
        { key: "Soldiers killed", value: "6", color: "red" },
        { key: "Fighter jets crashed (Kuwait)", value: "Several", color: "orange" },
        { key: "Iranian ships destroyed", value: "17", color: "cyan" },
        { key: "Nuclear sites targeted", value: "3+", color: "orange" },
        { key: "Objective", value: "Regime Change", color: "normal" },
        { key: "5th Fleet HQ struck by Iran", value: "Multiple times", color: "red" },
        { key: "Operation name", value: "Epic Fury", color: "normal" },
        { key: "Presidential statement", value: "Feb 28 at 2:30AM EST", color: "normal" }
      ]
    }
  },
  militaryAssets: [
    { icon: "🚢", value: "17", label: "Iranian ships\ndestroyed by US" },
    { icon: "🚀", value: "1,200+", label: "Israeli munitions\ndropped on Iran" },
    { icon: "💣", value: "550+", label: "Iranian ballistic\nmissiles fired" },
    { icon: "🛸", value: "1,000+", label: "Iranian drones\ndeployed" },
    { icon: "🛡️", value: "65+", label: "Missiles intercepted\nover Qatar alone" },
    { icon: "🏙️", value: "163", label: "Iranian cities\ntargeted" },
    { icon: "☢️", value: "3+", label: "Nuclear sites\nstruck (US)" },
    { icon: "✈️", value: "200+", label: "Israeli jets used\nin first wave" }
  ],
  timeline: [
    {
      date: "Jun 13, 2025",
      sublabel: "12-Day War Begins",
      title: "Israel strikes Iran — The 12-Day War",
      desc: "Israel bombs Iranian nuclear and military facilities in a surprise attack. Kills IRGC commanders, nuclear scientists. Iran retaliates with 550+ ballistic missiles and 1,000+ drones.",
      color: "orange"
    },
    {
      date: "Jun 22, 2025",
      sublabel: "",
      title: "US enters war — strikes Natanz, Fordow, Isfahan",
      desc: "Bunker-buster strikes on Iran's three primary nuclear facilities. Iran retaliates against Al Udeid base in Qatar.",
      color: "yellow"
    },
    {
      date: "Jun 24, 2025",
      sublabel: "",
      title: "Ceasefire brokered by US",
      desc: "Fragile ceasefire ends 12-Day War. Final toll: 1,190 killed in Iran, 28 in Israel. Iran's air defenses largely destroyed.",
      color: "cyan"
    },
    {
      date: "Feb 27, 2026",
      sublabel: "",
      title: "IAEA discovers hidden enriched uranium",
      desc: "IAEA finds Iran concealed highly enriched uranium in undamaged underground facility. Declares cannot confirm peaceful purposes.",
      color: "yellow"
    },
    {
      date: "Feb 28, 2026",
      sublabel: "2:30 AM EST",
      title: "🔴 Operation Roaring Lion + Epic Fury — Day 1",
      desc: "US & Israel begin coordinated strikes on Tehran, Isfahan, Qom, Karaj, Kermanshah. Supreme Leader Khamenei's compound destroyed. Trump announces regime change as objective.",
      color: "red"
    },
    {
      date: "Mar 1, 2026",
      sublabel: "",
      title: "Khamenei confirmed killed — Iran launches Operation True Promise IV",
      desc: "Iran confirms Supreme Leader's death. IRGC vows 'heaviest offensive in history.' Strikes 27 US bases across Middle East. Iran death toll hits 555.",
      color: "red"
    },
    {
      date: "Mar 2, 2026",
      sublabel: "",
      title: "IRGC HQ destroyed · Khamenei's wife dies",
      desc: "US confirms 6 soldiers killed. CENTCOM destroys 17 Iranian naval ships. Israel bombs Assembly of Experts mid-meeting. Death toll in Iran surpasses 1,045.",
      color: "red"
    },
    {
      date: "Mar 3–4, 2026",
      sublabel: "",
      title: "State broadcaster hit · 10th wave of Israeli strikes",
      desc: "IRIB broadcaster headquarters struck. Iran parliament targeted. Ground forces and naval operations announced. Total deaths surpass 2,400. Trump: 'Could last a month.'",
      color: "red"
    }
  ],
  regional: [
    { flag: "🇧🇭", name: "Bahrain", status: "struck", badge: "hit", desc: "US 5th Fleet HQ struck multiple times. International airport drone-hit. Residential buildings in Manama struck. 1 Asian worker killed." },
    { flag: "🇶🇦", name: "Qatar", status: "struck", badge: "hit", desc: "Al Udeid base hit by 2 ballistic missiles. Radar installation drone-struck. All flights suspended indefinitely. Schools moved to remote. 65+ missiles intercepted." },
    { flag: "🇰🇼", name: "Kuwait", status: "affected", badge: "partial", desc: "Multiple US warplanes crashed (crews survived). 1 girl killed from shrapnel injuries. 3+ killed total." },
    { flag: "🇸🇦", name: "Saudi Arabia", status: "affected", badge: "partial", desc: "Riyadh and Eastern Province (oil infrastructure) targeted. King Abdulaziz Air Base struck. No confirmed casualties reported." },
    { flag: "🇯🇴", name: "Jordan", status: "intercepted", badge: "intercepted", desc: "49 drones and ballistic missiles intercepted. Localized property damage from fragments. No casualties." },
    { flag: "🇮🇶", name: "Iraq", status: "struck", badge: "hit", desc: "Erbil International Airport area struck with visible smoke. Region destabilized. Iranian proxy groups active." },
    { flag: "🇱🇧", name: "Lebanon", status: "struck", badge: "hit", desc: "50+ killed, 335+ wounded from Israeli air strikes. Hezbollah launched rocket+drone attack on Haifa military base in retaliation." },
    { flag: "🌊", name: "Red Sea / Suez", status: "threatened", badge: "partial", desc: "Houthi threats resumed. Maersk rerouting vessels via Cape of Good Hope instead of Suez Canal due to risk." }
  ],
  sources: [
    "NewsAPI (Al Jazeera, CNN, BBC feeds)",
    "Wikipedia — 2026 Iran Conflict",
    "Hengaw Organization for Human Rights",
    "CENTCOM (US Military)",
    "Israeli Ministry of Health",
    "Iranian Red Crescent Society",
    "Lebanese Health Ministry",
    "The Guardian API"
  ]
};
