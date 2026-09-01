const NEWS_TIMEOUT = 5000;
const MAX_ARTICLES = 3;

async function fetchWithTimeout(url, timeout = NEWS_TIMEOUT) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Zendium/2.0",
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchRSS(url) {
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new Error(`RSS request failed: ${response.status}`);
  }

  return await response.text();
}

function extractItems(xml) {
  const items = [];
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];

  for (const item of itemMatches) {
    const titleMatch = item.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i);

    if (!titleMatch) {
      continue;
    }

    const title = titleMatch[1]
      .replace(/<!\[CDATA\[/g, "")
      .replace(/\]\]>/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();

    if (title) {
      items.push(title);
    }

    if (items.length >= MAX_ARTICLES) {
      break;
    }
  }

  return items;
}

async function getNewsFromFeeds(feeds) {
  const results = [];

  for (const feed of feeds) {
    try {
      //console.log(`NEWS: fetching ${feed.name}...`);

      const xml = await fetchRSS(feed.url);
      const items = extractItems(xml);

      results.push(...items);
      //console.log(`NEWS: ${feed.name} returned ${items.length} articles`);
    } catch (error) {
      console.error(`NEWS: failed to fetch ${feed.name}:`, error);
    }
  }
  return [...new Set(results)].slice(0, MAX_ARTICLES);
}

export async function getLatestNews() {
  //console.log("NEWS: getLatestNews() started");

  const world = await getNewsFromFeeds([
    {
      name: "BBC World",
      url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    },
  ]);

  const italy = await getNewsFromFeeds([
    {
      name: "ANSA",
      url: "https://www.ansa.it/sito/notizie/topnews/topnews_rss.xml",
    },
  ]);

  const finance = await getNewsFromFeeds([
    {
      name: "ANSA Economia",
      url: "https://www.ansa.it/sito/notizie/economia/economia_rss.xml",
    },
  ]);

  const available =
    world.length > 0 || italy.length > 0 || financeNews.length > 0;

  if (!available) {
    console.error("NEWS: no news available");

    return {
      available: false,
      error: "NEWS_UNAVAILABLE",
      world: [],
      italy: [],
      finance: [],
    };
  }

  const result = {
    available: true,
    world,
    italy,
    finance,
  };

  //console.log("NEWS: latest news ready", result);
  return result;
}
