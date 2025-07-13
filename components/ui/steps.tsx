import { cn } from "@/lib/utils";
import React, { FC, useImperativeHandle, useRef, useState } from "react";
import { View, ViewProps } from "react-native";
import PagerView, { PagerViewProps } from "react-native-pager-view";

export interface StepsRef {
  scrollToPage: (page: number) => void;
  getCurrentPage: () => number;
}

interface StepsProps extends ViewProps {
  pagerProps?: PagerViewProps;
  children: React.ReactNode;
  ref?: React.Ref<StepsRef>;
  onPageChange?: (page: number) => void; // Callback for page change
}

interface StepProps extends ViewProps {
  children: React.ReactNode;
}

export const Steps: FC<StepsProps> = ({
  children,
  pagerProps,
  ref,
  className,
  onPageChange,
  ...viewProps
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerViewRef = useRef<PagerView>(null);
  const totalSteps = Array.isArray(children) ? children.length : 1;

  useImperativeHandle(ref, () => ({
    scrollToPage: (page: number) => {
      pagerViewRef.current?.setPage(page);
    },
    getCurrentPage: () => currentPage,
  }));

  const handlePageSelected = (e: any) => {
    const page = e.nativeEvent.position;
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page); // Notify parent component
    }
  };

  return (
    <View {...viewProps} className={cn("flex-1", className)}>
      <View className="flex-row gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            className={cn(
              "h-2 flex-1 rounded",
              index <= currentPage ? "bg-primary" : "bg-gray-200"
            )}
          />
        ))}
      </View>

      <PagerView
        {...pagerProps}
        ref={pagerViewRef}
        style={{ flex: 1 }}
        onPageSelected={handlePageSelected}
      >
        {Array.isArray(children) ? (
          children.map((child, index) => (
            <View key={index} className="flex-1">
              {child}
            </View>
          ))
        ) : (
          <View className="flex-1">{children}</View>
        )}
      </PagerView>
    </View>
  );
};

export const Step = ({ children, className, ...viewProps }: StepProps) => {
  return (
    <View {...viewProps} className={cn("flex-1 pt-4", className)}>
      {children}
    </View>
  );
};
