import {
  generateAccount,
  generateRecipient,
  generateTransaction,
} from "./faker";

export const account = generateAccount();

export const recipients = Array.from({ length: 10 }, generateRecipient);

export const transactions = Array.from({ length: 20 }, () =>
  generateTransaction(recipients)
);
