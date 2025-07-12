export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
}

export interface Recipient {
  id: string;
  name: string;
  accountNumber: string;
}

export interface Transaction {
  id: string;
  recipient: string;
  accountNumber: string;
  amount: number;
  note?: string;
  date: Date;
  status: "completed" | "pending" | "failed";
  type: "sent" | "received";
}
