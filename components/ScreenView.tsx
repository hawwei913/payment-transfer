import { LinearGradient } from "expo-linear-gradient";
import type { FC, ReactNode } from "react";
import { View } from "react-native";
import { cn } from "~/lib/utils";

const ScreenView: FC<{
  children?: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <View
      className={cn("flex-1 py-safe px-4", className)}
    >
       <LinearGradient
        colors={["#eff6ff", "#fff", "#faf5ff"]}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        style={{ position: "absolute", inset: 0 }}
      />
      {children}
    </View>
  );
};

export default ScreenView;
