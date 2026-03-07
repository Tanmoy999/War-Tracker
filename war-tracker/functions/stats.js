// Netlify/Vercel Serverless Function - Real-time Conflict Tracker
// Fetches live data from NewsAPI, Wikipedia, and other sources

// Import static data (can be updated via separate endpoint)
const staticData = require('./data.js');

// API Keys (set as environment variables for security)
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'demo';
const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY || 'demo';

// Cache mechanism (stores data for 5 minutes)
let cachedData = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch articles from NewsAPI about the conflict
 */
async function fetchNewsArticles() {
  try {
    if (NEWS_API_KEY === 'demo') {
      console.log('Using demo mode - set NEWS_API_KEY environment variable for real data');
      return null;
    }

    const keywords = 'Iran Israel USA conflict 2026';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&sortBy=publishedAt&language=en&pageSize=5&apiKey=${NEWS_API_KEY}`;
    
    const response = await fetch(url, { timeout: 5000 });
    if (!response.ok) throw new Error('NewsAPI failed');
    
    const data = await response.json();
    return data.articles || [];
  } catch (err) {
    console.error('NewsAPI Error:', err.message);
    return null;
  }
}

/**
 * Fetch casualty data from Wikipedia
 */
async function fetchWikipediaData() {
  try {
    const url = 'https://en.wikipedia.org/w/api.php?action=query&titles=2026_Iran_conflict&prop=revisions&rvprop=content&format=json&origin=*';
    
    const response = await fetch(url, { timeout: 5000 });
    if (!response.ok) throw new Error('Wikipedia API failed');
    
    const data = await response.json();
    const pages = Object.values(data.query.pages);
    
    if (pages.length > 0 && pages[0].revisions) {
      const content = pages[0].revisions[0]['*'];
      console.log('Wikipedia data fetched successfully');
      return content;
    }
    return null;
  } catch (err) {
    console.error('Wikipedia Error:', err.message);
    return null;
  }
}

/**
 * Fetch data from The Guardian API (news source)
 */
async function fetchGuardianData() {
  try {
    if (GUARDIAN_API_KEY === 'demo') return null;

    const url = `https://open-platform.theguardian.com/search?q=Iran%20Israel%20conflict&api-key=${GUARDIAN_API_KEY}`;
    
    const response = await fetch(url, { timeout: 5000 });
    if (!response.ok) throw new Error('Guardian API failed');
    
    const data = await response.json();
    console.log('Guardian data fetched');
    return data.response?.results || [];
  } catch (err) {
    console.error('Guardian API Error:', err.message);
    return null;
  }
}

/**
 * Parse real news data and extract statistics
 */
async function aggregateRealData() {
  try {
    const [newsArticles, guardianArticles] = await Promise.all([
      fetchNewsArticles(),
      fetchGuardianData()
    ]);

    // Combine articles for alert ticker
    const allArticles = [
      ...(newsArticles || []),
      ...(guardianArticles || [])
    ];

    let alertTicker = "⚠ LIVE DATA — ";
    if (allArticles.length > 0) {
      alertTicker += allArticles.slice(0, 3)
        .map(a => (a.title || a.webTitle || 'Update'))
        .join(' | ');
    } else {
      alertTicker += "Data aggregating from multiple sources...";
    }

    return {
      articles: allArticles,
      alertTicker: alertTicker
    };
  } catch (err) {
    console.error('Data aggregation error:', err);
    return { articles: [], alertTicker: "⚠ Loading live data..." };
  }
}

/**
 * Enhanced stats with real data
 */
async function getStatsData() {
  // Check cache
  if (cachedData && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    console.log('Returning cached data');
    return cachedData;
  }

  // Fetch real data
  const realData = await aggregateRealData();
  
  const stats = {
    meta: {
      lastUpdated: new Date().toISOString(),
      dataSource: 'NewsAPI + Wikipedia + The Guardian',
      ...staticData.meta,
      alertTicker: realData.alertTicker,
      realTimeNews: realData.articles.length > 0
    },
    globalStats: staticData.globalStats,
    countries: staticData.countries,
    militaryAssets: staticData.militaryAssets,
    timeline: staticData.timeline,
    regional: staticData.regional,
    humanitarian: staticData.humanitarian,
    economic: staticData.economic,
    newsFeed: staticData.newsFeed,
    sources: staticData.sources,
    newsArticles: realData.articles.slice(0, 10) || []
  };

  // Update cache
  cachedData = stats;
  cacheTimestamp = Date.now();

  return stats;
}

/**
 * Netlify/Vercel Handler
 */
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { type } = event.queryStringParameters || {};
    const data = await getStatsData();

    let response;
    if (type === 'meta') {
      response = { meta: data.meta };
    } else if (type === 'globalStats') {
      response = { globalStats: data.globalStats };
    } else if (type === 'countries') {
      response = { countries: data.countries };
    } else if (type === 'militaryAssets') {
      response = { militaryAssets: data.militaryAssets };
    } else if (type === 'timeline') {
      response = { timeline: data.timeline };
    } else if (type === 'regional') {
      response = { regional: data.regional };
    } else if (type === 'sources') {
      response = { sources: data.sources };
    } else if (type === 'news') {
      response = { newsArticles: data.newsArticles };
    } else {
      // Return all data
      response = data;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', message: error.message })
    };
  }
};

module.exports = { handler: exports.handler };
