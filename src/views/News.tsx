import { useEffect, useState } from "react";
import TypingText from "@utils/TypingText";
import ThemeableIcon from "@assets/themeable-icon.svg?react";

type Props = {
  onComplete: () => void;
};

type WeatherData = Awaited<
  ReturnType<typeof window.zendium.weather.getCurrent>
>;

type NewsData = Awaited<ReturnType<typeof window.zendium.news.getLatest>>;

function getWeatherDescription(code: number) {
  if (code === 0) return "CLEAR SKY";
  if ([1, 2].includes(code)) return "PARTLY CLOUDY";
  if (code === 3) return "OVERCAST";
  if ([45, 48].includes(code)) return "FOG";
  if ([51, 53, 55].includes(code)) return "DRIZZLE";
  if ([61, 63, 65].includes(code)) return "RAIN";
  if ([71, 73, 75].includes(code)) return "SNOW";
  if ([80, 81, 82].includes(code)) return "RAIN SHOWERS";
  if ([95, 96, 99].includes(code)) return "THUNDERSTORM";

  return "UNKNOWN";
}

export default function News({ onComplete }: Props) {
  const [newsText, setNewsText] = useState("LOADING ..................");

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [weatherData, newsData] = await Promise.all([
          window.zendium.weather.getCurrent(),
          window.zendium.news.getLatest(),
        ]);

        //console.log("RENDERER WEATHER:", weatherData);
        //console.log("RENDERER NEWS:", newsData);

        if (!mounted) {
          return;
        }

        let text = "";

        // --------------------------------------------------
        // WEATHER
        // --------------------------------------------------

        if (!weatherData.available) {
          text += `WEATHER DATA UNAVAILABLE\n${weatherData.error}`;
        } else {
          const { location, weather } = weatherData;

          const description = getWeatherDescription(weather.weatherCode);

          text += `${location.city.toUpperCase()}, ${location.country.toUpperCase()}
${description}
TEMPERATURE: ${weather.temperature}°C
FEELS LIKE: ${weather.apparentTemperature}°C
HUMIDITY: ${weather.humidity}%
WIND: ${weather.windSpeed} KM/H
LOW: ${weather.minTemperature ?? "--"}°C
HIGH: ${weather.maxTemperature ?? "--"}°C`;
        }

        // --------------------------------------------------
        // NEWS
        // --------------------------------------------------

        text += "\n\nWORLD NEWS\n";

        if (newsData.available && newsData.world.length > 0) {
          text += newsData.world.map((headline) => `> ${headline}`).join("\n");
        } else {
          text += "NO WORLD NEWS AVAILABLE";
        }

        text += "\n\nITALY NEWS\n";

        if (newsData.available && newsData.italy.length > 0) {
          text += newsData.italy.map((headline) => `> ${headline}`).join("\n");
        } else {
          text += "NO ITALY NEWS AVAILABLE";
        }

/*         console.log("NEWS: display text ready");
        console.log(text); */

        setNewsText(text);
      } catch (error) {
        console.error("NEWS: request failed:", error);

        if (mounted) {
          setNewsText(
            "WEATHER DATA UNAVAILABLE\n\nNEWS UNAVAILABLE",
          );
        }
      }
    };

    loadData();

    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="text">
      <ThemeableIcon className="icon" />

      <div className="news-text">
        <TypingText
          key={newsText}
          text={newsText}
          showCursor={false}
          sound={false}
          speed={20}
        />
      </div>
    </div>
  );
}

console.log("news rendered");
