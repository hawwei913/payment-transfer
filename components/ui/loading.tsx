import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface LoadingProps {
  size?: 'small' | 'large';
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 'large', message }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size={size} color="#000" />
      {message && <Text className="mt-2 text-lg text-black">{message}</Text>}
    </View>
  );
};

export default Loading;