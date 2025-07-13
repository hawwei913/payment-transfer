import { createTransaction } from "@/api";
import ScreenHeader from "@/components/ScreenHeader";
import ScreenView from "@/components/ScreenView";
import {
  TransferForm,
  TransferFormData,
  TransferFormRef,
} from "@/components/transfer/TransferForm";
import { authenticateWithBiometrics } from "@/utils/biometric";
import { useMutation } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import { View } from "react-native";
import { toast } from "sonner-native";

export default function TransferScreen() {
  const router = useRouter();
  const formRef = useRef<TransferFormRef>(null);

  const { mutate } = useMutation({
    mutationFn: createTransaction,
    onSuccess: (transaction) => {
      router.push({
        pathname: "/transaction/[id]",
        params: { id: transaction.id },
      });
    },
  });

  const handleSubmit = async (data: TransferFormData) => {
    const res = await authenticateWithBiometrics();

    if (res.success) {
      mutate(data);
    } else {
      toast.error(res.error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      formRef.current?.reset();
    }, [])
  );

  return (
    <ScreenView>
      <ScreenHeader title="Transfer" />
      <View className="flex-1">
        <TransferForm ref={formRef} onSubmit={handleSubmit} />
      </View>
    </ScreenView>
  );
}
