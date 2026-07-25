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

      terminal: {
        write(data: string): void;

        onData(callback: (data: string) => void): () => void;

        resize(cols: number, rows: number): void;
      };
    };
  }
}
