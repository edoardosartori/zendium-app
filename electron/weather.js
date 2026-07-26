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

export async function getCurrentWeather() {
    console.log("getCurrentWeather called");
}
