declare global {
  interface Operation {
    id: number;
    type: "incoming" | "outgoing";
    amount: number;
    date: number;
    title: string;
    receiver?: number;
    sender?: number;
  }

  interface User {
    id: number;
    login: string;
    password: string;
    fullName: string;
    balance: number;
    accountNumber: string;
    operations: Operation[];
  }
}

export {};
