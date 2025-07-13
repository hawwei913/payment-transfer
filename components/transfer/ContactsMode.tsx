import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Loading from "@/components/ui/loading";
import { Text } from "@/components/ui/text";
import { loadContacts } from "@/utils/contact";
import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { TouchableOpacity, View } from "react-native";

interface ContactsModeProps {
  onSelect: (data: { name: string; accountNumber: string }) => void;
}

export const ContactsMode: FC<ContactsModeProps> = ({ onSelect }) => {
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: loadContacts,
  });
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const handleSelect = (contact: any) => {
    setSelectedContactId(contact.id);
    onSelect({
      name: contact.name,
      accountNumber: contact.accountNumber,
    });
  };

  if (isLoading) {
    return <Loading message="Loading contacts..." />;
  }

  return (
    <View className="gap-2">
      <Label className="text-lg font-semibold">Contacts</Label>
      {contacts.map((contact) => (
        <TouchableOpacity
          key={contact.id}
          onPress={() => handleSelect(contact)}
        >
          <Card
            className={`p-4 flex-row items-center gap-4 mb-2 ${
              selectedContactId === contact.id ? "bg-primary-foreground border-primary" : "border-gray-300"
            }`}
          >
            <Text className="text-sm font-medium">{contact.name}</Text>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
};
