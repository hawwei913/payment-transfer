import React from "react";
import { View } from "react-native";
import { cn } from "~/lib/utils";

const ScreenView: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <View
      className={cn("h-full", `py-safe px-4`, className)}
    >
      {children}
    </View>
  );
};

export default ScreenView;
