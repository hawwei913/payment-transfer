import { createTransaction, getAccount } from "@/api";
import ScreenLoading from "@/components/ScreenLoading";
import ScreenView from "@/components/ScreenView";
import { TransferForm, TransferFormData } from "@/components/TransferForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { View } from "react-native";

export default function TransferScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ["account"],
    queryFn: getAccount,
  });

  const { mutate } = useMutation({
    mutationKey: ["createTransaction"],
    mutationFn: createTransaction,
  });

  const handleSubmit = (data: TransferFormData) => {
    console.log("Submitting transfer data:", data);
    return;
  };

  if (isLoading) {
    return <ScreenLoading />;
  }

  return (
    <ScreenView>
      <View className="py-4 flex-1">
        <TransferForm
          currentBalance={data?.balance || 0}
          onSubmit={handleSubmit}
        />
      </View>
    </ScreenView>
  );
}
