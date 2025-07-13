import { RoundedIcon } from "@/components/RoundedIcon";
import { ContactsMode } from "@/components/transfer/ContactsMode";
import { ManualMode } from "@/components/transfer/ManualMode";
import { RecentMode } from "@/components/transfer/RecentMode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Step, Steps, StepsRef } from "@/components/ui/steps";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { HistoryIcon, PlusIcon, UsersIcon } from "@/lib/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";
import { z } from "zod/v4";

const transferSchema = z.strictObject({
  recipient: z
    .string("Recipient Name is required")
    .min(3, "Recipient Name is required"),
  accountNumber: z
    .string("Account number is required")
    .regex(/^\d{12}$/, "Account number must be 12 digits"),
  amount: z
    .string("Amount is required")
    .check((ctx) => {
      const numberValue = Number(ctx.value);

      if (isNaN(numberValue)) {
        ctx.issues.push({
          code: "invalid_type",
          message: "Amount must be a number",
          input: ctx.value,
          expected: "number",
        });
      } else if (numberValue <= 0) {
        ctx.issues.push({
          code: "too_small",
          message: "Amount must be greater than 0",
          input: ctx.value,
          minimum: 1,
          origin: "number",
        });
      }
    })
    .transform((value) => parseFloat(value)),
  note: z.string().optional(),
});

export type TransferFormData = z.infer<typeof transferSchema>;

export interface TransferFormRef {
  reset: () => void;
}

export interface TransferFormProps {
  onSubmit: (data: z.infer<typeof transferSchema>) => Promise<void>;
  ref?: React.Ref<TransferFormRef>;
}

export const TransferForm: FC<TransferFormProps> = ({ onSubmit, ref }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    setError,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(transferSchema),
  });

  useImperativeHandle(ref, () => ({
    reset: () => {
      reset();
      setSelectedMode("manual");
      stepsRef.current?.scrollToPage(0);
    },
  }));

  const stepsRef = useRef<StepsRef>(null);
  const [selectedMode, setSelectedMode] = useState<
    "contacts" | "recent" | "manual"
  >("manual");

  const [recipient, accountNumber] = watch(["recipient", "accountNumber"]);

  const showNext = useMemo(() => {
    if (selectedMode === "manual") {
      return true;
    } else if (selectedMode === "contacts" || selectedMode === "recent") {
      return !!recipient && !!accountNumber;
    }
    return false;
  }, [selectedMode, recipient, accountNumber]);

  const handleNext = async () => {
    const res = await trigger(["recipient", "accountNumber"]);

    if (res) {
      stepsRef.current?.scrollToPage(1);
    }
  };

  const handleFormSubmit = (data: TransferFormData) => {
    if (data.amount > 10000) {
      setError("amount", {
        type: "manual",
        message: "Amount exceeds the maximum limit of $10,000.",
      });
      toast.error("Amount exceeds the maximum limit of $10,000.");
      return;
    }
    onSubmit(data);
  };

  const handleChangeMode = (mode: "contacts" | "recent" | "manual") => {
    setSelectedMode(mode);

    // Clear recipient and account number when mode changes
    setValue("recipient", "");
    setValue("accountNumber", "");
  };

  const handleSelect = (data: {
    name: string;
    accountNumber: string;
    amount?: number;
    note?: string;
  }) => {
    setValue("recipient", data.name);
    setValue("accountNumber", data.accountNumber);
    if (data.amount) {
      setValue("amount", data.amount.toString());
    }
    if (data.note) {
      setValue("note", data.note);
    }
  };

  return (
    <Steps
      className="flex-1"
      ref={stepsRef}
      pagerProps={{ scrollEnabled: false }}
    >
      <Step>
        <View className="gap-4 flex-1">
          <Text className="text-xl font-semibold">
            How would you like to select the recipient?
          </Text>
          <View className="gap-4">
            <TouchableOpacity onPress={() => handleChangeMode("contacts")}>
              <Card
                className={`p-4 flex-row items-center gap-4 ${
                  selectedMode === "contacts"
                    ? "bg-primary-foreground border-primary"
                    : "border-gray-300"
                }`}
              >
                <RoundedIcon backgroundColor="#f0f4ff">
                  <UsersIcon size={20} />
                </RoundedIcon>
                <View className="gap-2">
                  <Text className="font-bold">From Contacts</Text>
                  <Text className="text-sm text-gray-500">
                    Select from your saved contacts
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleChangeMode("recent")}>
              <Card
                className={`p-4 flex-row items-center gap-4 ${
                  selectedMode === "recent"
                    ? "bg-primary-foreground border-primary"
                    : "border-gray-300"
                }`}
              >
                <RoundedIcon backgroundColor="#f0f4ff">
                  <HistoryIcon size={20} />
                </RoundedIcon>
                <View className="gap-2">
                  <Text className="font-bold">Recent Transactions</Text>
                  <Text className="text-sm text-gray-500">
                    Select from recent transactions
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleChangeMode("manual")}>
              <Card
                className={`p-4 flex-row items-center gap-4 ${
                  selectedMode === "manual"
                    ? "bg-primary-foreground border-primary"
                    : "border-gray-300"
                }`}
              >
                <RoundedIcon backgroundColor="#f0f4ff">
                  <PlusIcon size={20} />
                </RoundedIcon>
                <View className="gap-2">
                  <Text className="font-bold">Enter Manually</Text>
                  <Text className="text-sm text-gray-500">
                    Type recipient details manually
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerClassName="pb-16">
            {selectedMode === "manual" && (
              <ManualMode control={control} errors={errors} />
            )}

            {selectedMode === "recent" && (
              <RecentMode onSelect={handleSelect} />
            )}

            {selectedMode === "contacts" && (
              <ContactsMode onSelect={handleSelect} />
            )}
          </ScrollView>

          {showNext && (
            <View className="flex-row items-center gap-4 absolute bottom-0">
              <Button className="flex-1" onPress={() => handleNext()}>
                <Text>Next</Text>
              </Button>
            </View>
          )}
        </View>
      </Step>

      <Step>
        <View className="gap-4 flex-1">
          <View className="gap-2">
            <Label className="text-lg font-semibold">Recipient</Label>
            <Card className="p-4">
              <Text className="font-bold">{recipient}</Text>
              <Text className="text-sm text-gray-500">
                Account Number: {accountNumber}
              </Text>
            </Card>
          </View>

          <View className="gap-2">
            <Label className="text-lg font-semibold">Amount</Label>
            <Text className="text-sm text-gray-500">
              Available Balance: ${10000}
            </Text>
            <Controller
              name="amount"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  className={`rounded-lg p-2 ${
                    errors.amount ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
            />
            {errors.amount && (
              <Text className="text-red-500 text-sm">
                {errors.amount.message}
              </Text>
            )}
          </View>

          <View className="gap-2">
            <Label className="text-lg font-semibold">Note</Label>
            <Controller
              name="note"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  onChangeText={onChange}
                  value={value}
                  placeholder="Add a note (optional)"
                  className={`rounded-lg p-2 ${
                    errors.note ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}
            />
          </View>

          <View className="flex-row items-center gap-4 absolute bottom-0">
            <Button
              className="flex-1"
              variant="outline"
              onPress={() => stepsRef.current?.scrollToPage(0)}
            >
              <Text>Back</Text>
            </Button>
            <Button className="flex-1" onPress={handleSubmit(handleFormSubmit)}>
              <Text>Confirm Transfer</Text>
            </Button>
          </View>
        </View>
      </Step>
    </Steps>
  );
};
