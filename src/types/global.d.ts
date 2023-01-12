declare global {
  interface Operation {
    id: number;
    type: "incoming" | "outgoing";
    amount: number;
    date: number;
    title: string;
    receiver?: number;
    sender?: number;
    balanceAfterOperation: number;
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

  interface Card {
    id: string;
    validThru: number;
    ownerID: number;
    CVC: number;
    requestPending: boolean;
  }

  interface PendingCardRequest {
    card: Card;
    owner: User;
  }
}

export {};
