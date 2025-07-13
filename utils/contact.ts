import { faker } from "@faker-js/faker";
import * as Contacts from "expo-contacts";

export const requestContactsPermission = async () => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    return {
      granted: status === "granted",
      canAskAgain: status !== "denied",
    };
  } catch (error) {
    console.error("Error requesting contacts permission:", error);
    return { granted: false, canAskAgain: false };
  }
};

export const loadContacts = async () => {
  try {
    const permission = await requestContactsPermission();
    if (!permission.granted) {
      return [];
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name],
      sort: Contacts.SortTypes.FirstName,
    });

    // Filter and transform contacts
    const transformedContacts = data.map((contact) => ({
      id: faker.string.uuid(),
      name: contact.name || "Unknown",
      accountNumber: faker.finance.accountNumber(12),
    }));
    return transformedContacts;
  } catch (error) {
    console.error("Error loading contacts:", error);
    return [];
  }
};
