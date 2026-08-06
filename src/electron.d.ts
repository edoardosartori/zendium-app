export {};

declare global {
  interface Window {
    zendium: {
      system: {
        getInfo(): Promise<{
          cpu: string;
          cpuCores: number;
          ramTotal: string;
          ramFree: string;
          architecture: string;
          kernel: string;
          hostname: string;
          username: string;
          platform: string;
          operatingSystem: string;
          gpu: string;
          storage: {
            mount: string;
            total: string;
            used: string;
            available: string;
            usedPercent: string;
          }[];
          externalDisplay: boolean;
          network: {
            interface: string;
            ip: string;
            mac: string;
          }[];
          battery: {
            percent: number;
            charging: boolean;
            acConnected: boolean;
            timeRemaining: number | null;
          } | null;
        }>;
      };

      location: {
        getCurrent(): Promise<{
          available: true;
          city: string;
          country: string;
          countryCode: string;
          latitude: number;
          longitude: number;
          timezone: string;
        }>;
      };

      weather: {
        getCurrent(): Promise<
          | {
              available: true;
              location: {
                city: string;
                country: string;
                countryCode: string | null;
                latitude: number;
                longitude: number;
              };
              weather: {
                temperature: number;
                apparentTemperature: number;
                humidity: number;
                windSpeed: number;
                weatherCode: number;
                minTemperature: number | null;
                maxTemperature: number | null;
              };
            }
          | {
              available: false;
              error:
                | "LOCATION_UNAVAILABLE"
                | "WEATHER_API_ERROR"
                | "INVALID_WEATHER_DATA"
                | "WEATHER_TIMEOUT"
                | "WEATHER_OFFLINE";
            }
        >;
      };

      news: {
        getLatest(): Promise<
          | {
              available: true;
              world: string[];
              italy: string[];
            }
          | {
              available: false;
              error: "NEWS_UNAVAILABLE";
              world: string[];
              italy: string[];
            }
        >;
      };

      liveData: {
        getLiveData(): Promise<{
          weather: Awaited<
            ReturnType<Window["zendium"]["weather"]["getCurrent"]>
          >;
          news: Awaited<ReturnType<Window["zendium"]["news"]["getLatest"]>>;
        }>;
      };

      terminal: {
        write(data: string): void;
        onData(callback: (data: string) => void): () => void;
        resize(cols: number, rows: number): void;
        getCwd(): Promise<
          | { available: true; cwd: string }
          | { available: false; error: "NO_TERMINAL" | "CWD_UNAVAILABLE" }
        >;
      };

      filesystem: {
        readDir(dirPath: string): Promise<
          | {
              available: true;
              path: string;
              items: {
                name: string;
                isDirectory: boolean;
                isSymlink: boolean;
              }[];
            }
          | { available: false; error: "READ_DIR_ERROR" }
        >;
      };
    };
  }
}
