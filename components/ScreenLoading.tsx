import { ActivityIndicator } from "react-native";
import ScreenView from "./ScreenView";
import { Text } from "./ui/text";

const ScreenLoading = () => {
  return (
    <ScreenView className="items-center justify-center">
      <ActivityIndicator />
      <Text>Loading...</Text>
    </ScreenView>
  );
};

export default ScreenLoading;
