import ScreenView from "@/components/ScreenView";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { View } from "react-native";
import { Button } from "~/components/ui/button";

export default function NotFoundScreen() {
  return (
    <ScreenView>
      <View className="flex-1 items-center justify-center gap-6 p-6">
        <Text className="text-xl font-bold text-center">
          This screen doesn't exist.
        </Text>
        <Link href="/" asChild>
          <Button variant="ghost">
            <Text className="text-base">Go to Home</Text>
          </Button>
        </Link>
      </View>
    </ScreenView>
  );
}
