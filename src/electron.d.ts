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
          gpu: string;
          storage: {
            name: string;
            size: string;
            type: string;
          }[];
          network: {
            interface: string;
            ip: string;
            mac: string;
          }[];
          battery: {
            percent: number;
            charging: boolean;
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
