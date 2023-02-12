declare global {
  interface Operation {
    id: number;
    amount: number;
    date: number;
    title: string;
    from: number;
    to: number;
    sendersBalanceAfterOperation: number;
    receiversBalanceAfterOperation: number;
  }

  interface User {
    id: number;
    login: number;
    password: string;
    fullName: string;
    balance: number;
    accountNumber: string;
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
