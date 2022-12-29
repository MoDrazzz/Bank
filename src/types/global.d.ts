declare global {
  interface Operation {
    id: number;
    type: "incoming" | "outgoing";
    amount: number;
    date: number;
    title: string;
    receiver: number;
  }

  interface User {
    id: number;
    login: number;
    password: string;
    fullName: string;
    balance: number;
    accountNumber: string;
    operations: Operation[];
  }
}

export {};
