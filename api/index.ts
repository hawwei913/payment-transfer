import { account, recipients, transactions } from "@/data";
import { generateRecipient } from "@/data/faker";
import { Recipient, Transaction } from "@/types";
import { delay } from "@/utils";
import { faker } from "@faker-js/faker";

const getAccount = async () => {
  await delay(1000);

  return account;
};

const getTransactions = async () => {
  await delay(1000);

  return transactions.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

const getTransaction = async (id: string) => {
  await delay(1000);

  const transaction = transactions.find((t) => t.id === id);

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return transaction;
};

const createTransaction = async (
  transaction: Pick<
    Transaction,
    "recipient" | "accountNumber" | "amount" | "note"
  >
) => {
  const recipientExists = recipients.find(
    (recipient) => recipient.accountNumber === transaction.accountNumber
  );

  if (!recipientExists) {
    await createRecipient(transaction.recipient, transaction.accountNumber);
  }

  const newTransaction: Transaction = {
    ...transaction,
    id: faker.string.uuid(),
    type: "sent",
    status: "pending",
    date: new Date(),
  };

  transactions.push(newTransaction);

  return newTransaction;
};

const updateTransaction = async (id: string, data: Partial<Transaction>) => {
  await delay(1000);

  const index = transactions.findIndex((t) => t.id === id);

  if (index === -1) {
    throw new Error("Transaction not found");
  }

  const updatedTransaction = { ...transactions[index], ...data };

  transactions[index] = updatedTransaction;

  return updatedTransaction;
};

const getRecipients = async () => {
  await delay(1000);

  return recipients;
};

const createRecipient = async (name: string, accountNumber: string) => {
  await delay(1000);

  const newRecipient: Recipient = generateRecipient(name, accountNumber);

  recipients.push(newRecipient);

  return newRecipient;
};

export {
  createRecipient,
  createTransaction,
  getAccount,
  getRecipients,
  getTransaction,
  getTransactions,
  updateTransaction
};

