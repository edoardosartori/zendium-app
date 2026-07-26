const LOCATION_TIMEOUT = 5000;

async function fetchWithTimeout(url, timeout = LOCATION_TIMEOUT) {
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

export async function getCurrentLocation() {
  try {
    const response = await fetchWithTimeout("https://ipapi.co/json/");

    if (!response.ok) {
      console.error(`Location API error: HTTP ${response.status}`);

      return {
        available: false,
        error: "API_ERROR",
      };
    }

    const data = await response.json();

    if (
      typeof data?.city !== "string" ||
      typeof data?.country_name !== "string" ||
      typeof data?.latitude !== "number" ||
      typeof data?.longitude !== "number"
    ) {
      console.error("Location API returned invalid data.");

      return {
        available: false,
        error: "INVALID_DATA",
      };
    }

    return {
      available: true,
      city: data.city,
      country: data.country_name,
      countryCode: data.country_code ?? null,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone ?? null,
    };
  } catch (error) {
    if (error?.name === "AbortError") {
      console.error("Location API request timed out.");

      return {
        available: false,
        error: "TIMEOUT",
      };
    }

    console.error("Location request failed:", error);

    return {
      available: false,
      error: "OFFLINE",
    };
  }
}
