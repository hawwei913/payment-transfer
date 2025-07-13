import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { FC } from "react";
import { Controller } from "react-hook-form";

interface ManualModeProps {
  control: any;
  errors: any;
}

export const ManualMode: FC<ManualModeProps> = ({ control, errors }) => {
  return (
    <Card className="gap-2 p-4">
      <Label className="text-lg font-semibold">Enter Recipient Details</Label>
      <Label className="text-sm">Recipient Name</Label>
      <Controller
        name="recipient"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            onChangeText={onChange}
            value={value}
            placeholder="Enter recipient's full name"
            className={`rounded-lg p-2 ${
              errors.recipient ? "border-red-500" : "border-gray-300"
            }`}
          />
        )}
      />
      {errors.recipient && (
        <Text className="text-red-500 text-sm">{errors.recipient.message}</Text>
      )}

      <Label className="text-sm">Account Number</Label>
      <Controller
        name="accountNumber"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            keyboardType="numeric"
            onChangeText={onChange}
            value={value}
            placeholder="Enter account number"
            className={`rounded-lg p-2 ${
              errors.accountNumber ? "border-red-500" : "border-gray-300"
            }`}
          />
        )}
      />
      {errors.accountNumber && (
        <Text className="text-red-500 text-sm">{errors.accountNumber.message}</Text>
      )}
    </Card>
  );
};
