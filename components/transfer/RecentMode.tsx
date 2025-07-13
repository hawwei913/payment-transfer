import { getRecipients, getTransactions } from "@/api";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Loading from "@/components/ui/loading";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { TouchableOpacity, View } from "react-native";

interface RecentModeProps {
  onSelect: (data: {
    name: string;
    accountNumber: string;
    amount: number;
    note?: string;
  }) => void;
}

export const RecentMode: FC<RecentModeProps> = ({ onSelect }) => {
  const { data: recentTransactions = [], isLoading: isLoadingTransactions } =
    useQuery({
      queryKey: ["transactions"],
      queryFn: getTransactions,
    });
  const { data: recipients = [], isLoading: isLoadingRecipients } = useQuery({
    queryKey: ["recipients"],
    queryFn: getRecipients,
  });
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  const handleSelect = (transaction: any, recipientName: string) => {
    setSelectedTransactionId(transaction.id);
    onSelect({
      name: recipientName,
      accountNumber: transaction.accountNumber,
      amount: transaction.amount,
      note: transaction.note,
    });
  };

  if (isLoadingTransactions || isLoadingRecipients) {
    return <Loading message="Loading recent transactions..." />;
  }

  return (
    <View className="gap-2">
      <Label className="text-lg font-semibold">Recent Transactions</Label>
      {recentTransactions.slice(-10).map((transaction) => {
        const recipientName =
          recipients.find((r) => r.accountNumber === transaction.accountNumber)
            ?.name || "Unknown";

        return (
          <TouchableOpacity
            key={transaction.id}
            onPress={() => handleSelect(transaction, recipientName)}
          >
            <Card
              className={`p-4 flex-row justify-between items-center ${
                selectedTransactionId === transaction.id
                  ? "bg-primary-foreground border-primary"
                  : "border-gray-300"
              }`}
            >
              <View className="gap-2">
                <Text className="text-sm font-medium">{recipientName}</Text>
                <Text className="text-sm text-gray-500">
                  {transaction.accountNumber}
                </Text>
              </View>
              <View className="gap-2 items-end">
                <Text className="text-sm font-medium">
                  ${transaction.amount}
                </Text>
                <Text className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
