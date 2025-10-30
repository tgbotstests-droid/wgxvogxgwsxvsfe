// Динамический импорт для избежания проблем с Buffer при начальной загрузке
let TransportWebUSB: any = null;
let Eth: any = null;
let Buffer: any = null;

async function ensureDependencies() {
  if (!Buffer) {
    const bufferModule = await import("buffer");
    Buffer = bufferModule.Buffer;
    if (typeof window !== 'undefined') {
      (window as any).Buffer = Buffer;
    }
  }
  
  if (!TransportWebUSB) {
    const transport = await import("@ledgerhq/hw-transport-webusb");
    TransportWebUSB = transport.default;
  }
  
  if (!Eth) {
    const eth = await import("@ledgerhq/hw-app-eth");
    Eth = eth.default;
  }
}

export interface LedgerAccount {
  address: string;
  path: string;
}

export interface LedgerDeviceInfo {
  model: string;
  version: string;
}

export class LedgerClient {
  private transport: any = null;
  private eth: any = null;

  async connect(): Promise<LedgerDeviceInfo> {
    try {
      // Загружаем зависимости динамически
      await ensureDependencies();
      
      this.transport = await TransportWebUSB.create();
      this.eth = new Eth(this.transport);
      
      // Get device info
      const deviceModel = this.transport.deviceModel?.productName || "Ledger Device";
      
      return {
        model: deviceModel,
        version: "Unknown"
      };
    } catch (error) {
      console.error("Failed to connect to Ledger:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.transport) {
      await this.transport.close();
      this.transport = null;
      this.eth = null;
    }
  }

  async getAddress(path: string = "44'/60'/0'/0/0"): Promise<string> {
    if (!this.eth) {
      throw new Error("Ledger not connected");
    }

    const result = await this.eth.getAddress(path);
    return result.address;
  }

  async getAccounts(numAccounts: number = 5): Promise<LedgerAccount[]> {
    if (!this.eth) {
      throw new Error("Ledger not connected");
    }

    const accounts: LedgerAccount[] = [];
    for (let i = 0; i < numAccounts; i++) {
      const path = `44'/60'/0'/0/${i}`;
      const result = await this.eth.getAddress(path);
      accounts.push({
        address: result.address,
        path,
      });
    }

    return accounts;
  }

  async signTransaction(path: string, rawTxHex: string): Promise<string> {
    if (!this.eth) {
      throw new Error("Ledger not connected");
    }

    const signature = await this.eth.signTransaction(path, rawTxHex);
    return signature;
  }

  isConnected(): boolean {
    return this.transport !== null && this.eth !== null;
  }
}

// Singleton instance
export const ledgerClient = new LedgerClient();
