import { Account, Recipient, Transaction } from "@/types";
import { faker } from "@faker-js/faker";

export const generateAccount = (): Account => {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    accountNumber: faker.finance.accountNumber(),
    balance: parseFloat(
      faker.finance.amount({ min: 1000, max: 10000, dec: 2 })
    ),
  };
};

export const generateTransaction = (recipients: Recipient[]): Transaction => {
  const recipient = faker.helpers.arrayElement(recipients);

  return {
    id: faker.string.uuid(),
    date: faker.date.recent({ days: 30 }),
    amount: parseFloat(faker.finance.amount()),
    type: faker.helpers.arrayElement(["sent", "received"]),
    recipient: recipient.id,
    accountNumber: recipient.accountNumber,
    status: faker.helpers.arrayElement(["completed"]),
  };
};

export const generateRecipient = (name?: string): Recipient => {
  return {
    id: faker.string.uuid(),
    name: name || faker.person.fullName(),
    accountNumber: faker.finance.accountNumber(),
  };
};
