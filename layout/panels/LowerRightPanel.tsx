import { useEffect, useState } from "react";

const TITLE_LINES = [
  "╔══════════════════════════╗",
  "║        LIVE DATA         ║",
  "╚══════════════════════════╝",
];

export default function LowerRightPanel() {
  const [text, setText] = useState("LOADING LIVE DATA...");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const { weather, news } = await window.zendium.liveData.getLiveData();

        if (!mounted) return;

        const lines: string[] = [];

        // ---------------------------------------
        // WEATHER
        // ---------------------------------------

        if (weather.available) {
          lines.push(
            `${weather.location.city.toUpperCase()}, ${weather.location.country.toUpperCase()}`,
          );

          lines.push(
            `${weather.weather.temperature}°C  •  ${weather.weather.apparentTemperature}°C FEELS LIKE`,
          );

          lines.push(
            `${weather.weather.humidity}% HUMIDITY  •  ${weather.weather.windSpeed} KM/H WIND`,
          );
        } else {
          lines.push("WEATHER UNAVAILABLE");
        }

        lines.push("");
        lines.push("────────────────────────────");
        lines.push("");

        // ---------------------------------------
        // NEWS
        // ---------------------------------------

        if (news.available) {
          lines.push("WORLD");

          news.world.forEach((headline: string) => {
            lines.push(`• ${headline}`);
          });

          lines.push("");
          lines.push("ITALY");

          news.italy.forEach((headline: string) => {
            lines.push(`• ${headline}`);
          });
        } else {
          lines.push("NEWS UNAVAILABLE");
        }

        setText(lines.join("\n"));
      } catch (err) {
        console.error("LIVE DATA:", err);

        if (mounted) {
          setText("LIVE DATA OFFLINE");
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="panel panel--lower-right">
      <div className="panel-title">
        {TITLE_LINES.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      <div className="panel-text" style={{ whiteSpace: "pre-wrap" }}>
        {text}
      </div>
    </div>
  );
}

console.log("LowerRightPanel rendered");
