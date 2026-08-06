import { getCurrentLocation } from "./location.js";

import { getCurrentWeather } from "./weather.js";
import { getLatestNews } from "./news.js";

export async function getLiveData() {
  const location = await getCurrentLocation();

  const [weather, news] = await Promise.all([
    getCurrentWeather(location.available ? location : null),
    getLatestNews(),
  ]);

  return {
    weather,
    news,
  };
}
