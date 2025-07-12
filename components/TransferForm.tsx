import { Recipient } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { z } from "zod/v4";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Text } from "./ui/text";
import { Textarea } from "./ui/textarea";

const transferSchema = z.strictObject({
  recipient: z.string().min(3, "Recipient Name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  amount: z.string().refine((value) => {
    const numberValue = Number(value);
    return !isNaN(numberValue) && numberValue > 0;
  }, "Amount must be a positive number"),
  note: z.string().optional(),
});

export type TransferFormData = z.infer<typeof transferSchema>;

export interface TransferFormProps {
  currentBalance: number;
  recipients?: Recipient[];
  onSubmit: (data: z.infer<typeof transferSchema>) => void;
}

export const TransferForm: FC<TransferFormProps> = ({
  currentBalance,
  recipients = [],
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(transferSchema),
  });

  const handleFormSubmit = (data: TransferFormData) => {
    onSubmit(data);
  };

  return (
    <View className="flex-1 gap-4">
      <View className="gap-2">
        <Label className="text-lg font-semibold">Recipient</Label>
        <Controller
          name="recipient"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              onChangeText={onChange}
              value={value}
              placeholder="Enter recipient name"
              className={`border rounded-md p-2 ${
                errors.recipient ? "border-red-500" : "border-gray-300"
              }`}
            />
          )}
        />
        {errors.recipient && (
          <Text className="text-red-500 text-sm">
            {errors.recipient.message}
          </Text>
        )}
      </View>

      <View className="gap-2">
        <Label className="text-lg font-semibold">Amount</Label>
        <Controller
          name="amount"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              onChangeText={onChange}
              value={value}
              placeholder="Enter amount"
              keyboardType="numeric"
              className={`border rounded-md p-2 ${
                errors.amount ? "border-red-500" : "border-gray-300"
              }`}
            />
          )}
        />
        {errors.amount && (
          <Text className="text-red-500 text-sm">{errors.amount.message}</Text>
        )}
      </View>

      <View className="gap-2">
        <Label className="text-lg font-semibold">Optional Note</Label>
        <Controller
          name="note"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Textarea
              onChangeText={onChange}
              value={value}
              placeholder="Add a note (optional)"
              className={`border rounded-md p-2 ${
                errors.note ? "border-red-500" : "border-gray-300"
              }`}
            />
          )}
        />
      </View>

      <Button onPress={handleSubmit(handleFormSubmit)}>
        <Text>Confirm Transfer</Text>
      </Button>
    </View>
  );
};
