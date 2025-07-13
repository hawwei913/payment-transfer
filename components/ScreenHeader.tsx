import { ArrowLeftIcon } from "@/lib/icons";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Button } from "./ui/button";
import { Text } from "./ui/text";

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ScreenHeader = ({
  title,
  showBack = false,
  onBack,
  leftIcon,
  rightIcon,
}: ScreenHeaderProps) => {
  const router = useRouter();
  return (
    <View className="flex-row items-center py-4 gap-2">
      {showBack && (
        <Button
          variant="ghost"
          size="icon"
          onPress={onBack || (() => router.back())}
        >
          <ArrowLeftIcon size={24} className="text-primary" />
        </Button>
      )}
      {leftIcon && <View>{leftIcon}</View>}
      <Text
        className="text-2xl font-bold flex-1 text-primary"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
      {rightIcon && <View>{rightIcon}</View>}
    </View>
  );
};

export default ScreenHeader;
