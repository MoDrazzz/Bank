declare global {
  interface Operation {
    id: number;
    amount: number;
    date: number;
    title: string;
    sender: number;
    receiver: number;
    sendersBalanceAfterOperation: number;
    receiversBalanceAfterOperation: number;
  }

  interface User {
    id: number;
    login: number;
    password: string;
    fullName: string;
    type: string;
  }

  interface Account {
    id: number;
    balance: number;
    number: string;
    ownerID: number;
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
