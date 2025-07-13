import { getTransaction, updateTransaction } from "@/api";
import { RoundedIcon } from "@/components/RoundedIcon";
import ScreenHeader from "@/components/ScreenHeader";
import ScreenLoading from "@/components/ScreenLoading";
import ScreenView from "@/components/ScreenView";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { CircleCheckBigIcon } from "@/lib/icons/CircleCheckBig";
import { CircleXIcon } from "@/lib/icons/CircleX";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function TransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: transaction,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["transaction", id],
    queryFn: () => getTransaction(id),
  });

  const isPending = transaction?.status === "pending";
  const isSuccessful = transaction?.status === "completed";

  useEffect(() => {
    if (isPending) {
      setTimeout(async () => {
        const shouldFail = Math.random() < 0.1;
        const newStatus = shouldFail ? "failed" : "completed";

        try {
          await updateTransaction(id, { status: newStatus });
          refetch();
        } catch (error) {
          console.error("Failed to update transaction status", error);
        }
      }, 2000);
    }
  }, [isPending, id, refetch]);

  const bgColor = isPending ? "#FEF3C7" : isSuccessful ? "#D1FAE5" : "#FEE2E2";

  const icon = isPending ? (
    <ActivityIndicator className="text-yellow-500" />
  ) : isSuccessful ? (
    <CircleCheckBigIcon className="text-green-500" />
  ) : (
    <CircleXIcon className="text-red-500" />
  );

  const title = isPending
    ? "Transfer Processing..."
    : isSuccessful
      ? "Transfer Successful!"
      : "Transfer Failed!";

  if (isLoading) {
    return <ScreenLoading />;
  }

  if (!transaction) {
    return (
      <ScreenView>
        <Text className="text-lg font-bold">Transaction not found</Text>
      </ScreenView>
    );
  }

  return (
    <ScreenView>
      <ScreenHeader title="Transaction Details" showBack />
      <View className="p-4 pt-16">
        <RoundedIcon
          backgroundColor={bgColor}
          className="self-center mb-4 w-16 h-16"
        >
          {icon}
        </RoundedIcon>
        <Text className="text-xl font-bold text-center mb-2">{title}</Text>
        <Text className="text-lg text-center mb-4">
          ${transaction.amount.toFixed(2)} sent to {transaction.recipient}
        </Text>
        <Card className="bg-gray-100 p-4 rounded-md">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm font-medium">Transaction ID</Text>
            <Text className="text-sm">{transaction.id}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm font-medium">Date & Time</Text>
            <Text className="text-sm">
              {new Date(transaction.date).toLocaleString()}
            </Text>
          </View>
          {transaction.note && (
            <View className="flex-row justify-between">
              <Text className="text-sm font-medium">Note</Text>
              <Text className="text-sm">{transaction.note}</Text>
            </View>
          )}
        </Card>
      </View>
    </ScreenView>
  );
}
