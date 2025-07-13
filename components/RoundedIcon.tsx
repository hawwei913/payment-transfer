import { View } from "react-native";
import { cn } from "~/lib/utils";

interface RoundedIconProps {
  children: React.ReactNode;
  className?: string;
  backgroundColor?: string;
}

export function RoundedIcon({
  children,
  className,
  backgroundColor,
}: RoundedIconProps) {
  return (
    <View
      className={cn(
        "h-12 w-12 rounded-full items-center justify-center flex-row",
        className
      )}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      {children}
    </View>
  );
}
