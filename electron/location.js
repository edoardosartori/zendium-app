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
  //console.log("LOCATION: getCurrentLocation() started");

  try {
    const response = await fetchWithTimeout(
      "https://ipwho.is/",
    );

    console.log("LOCATION: response received", {
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const body = await response.text();

      console.error("Location API error:", {
        status: response.status,
        statusText: response.statusText,
        body,
      });

      return {
        available: false,
        error: "API_ERROR",
      };
    }

    const data = await response.json();

    if (
      data?.success !== true ||
      typeof data?.city !== "string" ||
      typeof data?.country !== "string" ||
      typeof data?.latitude !== "number" ||
      typeof data?.longitude !== "number"
    ) {
      //console.error("Location API returned invalid data.", data);

      return {
        available: false,
        error: "INVALID_DATA",
      };
    }

    //console.log("LOCATION: valid data received");

    return {
      available: true,
      city: data.city,
      country: data.country,
      countryCode: data.country_code ?? null,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone?.id ?? null,
    };
  } catch (error) {
    if (error?.name === "AbortError") {
      console.error(
        "Location API request timed out.",
      );

      return {
        available: false,
        error: "TIMEOUT",
      };
    }

    console.error(
      "Location request failed:",
      error,
    );

    return {
      available: false,
      error: "OFFLINE",
    };
  }
}
