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
          platform: string;
          operatingSystem: string;
        }>;
      };
    };
  }
}
