const WEATHER_TIMEOUT = 5000;

async function fetchWithTimeout(url, timeout = WEATHER_TIMEOUT) {
  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    return await fetch(url, {
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function getCurrentWeather(location) {
  if (
    !location ||
    typeof location.latitude !== "number" ||
    typeof location.longitude !== "number"
  ) {
    return {
      available: false,
      error: "LOCATION_UNAVAILABLE",
    };
  }

  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: "1",
  });

  try {
    const response = await fetchWithTimeout(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    );
    if (!response.ok) {
      const body = await response.text();

      console.error("Weather API error:", {
        status: response.status,
        statusText: response.statusText,
        body,
      });
      return {
        available: false,
        error: "WEATHER_API_ERROR",
      };
    }

    const data = await response.json();

    if (!data?.current || typeof data.current.temperature_2m !== "number") {
      console.error("Weather API returned invalid data.", data);
      return {
        available: false,
        error: "INVALID_WEATHER_DATA",
      };
    }

    return {
      available: true,
      location: {
        city: location.city,
        country: location.country,
        countryCode: location.countryCode,
        latitude: location.latitude,
        longitude: location.longitude,
      },

      weather: {
        temperature: data.current.temperature_2m,
        apparentTemperature: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        minTemperature: data.daily?.temperature_2m_min?.[0] ?? null,
        maxTemperature: data.daily?.temperature_2m_max?.[0] ?? null,
      },
    };
  } catch (error) {
    if (error?.name === "AbortError") {
      console.error("Weather API request timed out.");

      return {
        available: false,
        error: "WEATHER_TIMEOUT",
      };
    }

    console.error("Weather request failed:", error);
    return {
      available: false,
      error: "WEATHER_OFFLINE",
    };
  }
}
