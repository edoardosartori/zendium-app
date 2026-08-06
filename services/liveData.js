// services/liveData.js
import { getCurrentWeather } from "./weather";
import { getLatestNews } from "./news";

export async function getLiveData() {
  const [weather, news] = await Promise.all([
    getCurrentWeather(),
    getLatestNews(),
  ]);

  return {
    weather,
    news,
  };
}
