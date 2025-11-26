import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface SpeedIndicatorProps {
  speed: string;
  onPress?: () => void;
}

const SpeedIndicator = ({ speed, onPress }: SpeedIndicatorProps) => {
  const speedNum = parseInt(speed, 10);
  if (isNaN(speedNum)) return null;

  const getSpeedBarColor = (num: number, level: number) => {
    if (num === 4) return "bg-purple-400";
    if (num >= level) {
      if (num === 1) return "bg-emerald-400";
      if (num === 2) return "bg-yellow-400";
      if (num === 3) return "bg-orange-500";
      return "bg-blue-400";
    }
    return "bg-slate-600 opacity-25";
  };

  const getSpeedLabelColor = (num: number) => {
    if (num === 1) return "text-emerald-400";
    if (num === 2) return "text-yellow-400";
    if (num === 3) return "text-orange-500";
    if (num === 4) return "text-purple-400";
    return "text-slate-100";
  };

  const getSpeedLabel = (num: number) => {
    if (num === 1) return "Low";
    if (num === 2) return "Medium";
    if (num === 3) return "Fast";
    if (num === 4) return "Auto";
    return "";
  };

  const content = (
    <View className="px-3 py-1.5 rounded-full bg-slate-700/50 flex-row items-center gap-2">
      <Text className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Vitesse</Text>
      <View className="flex-row gap-1 items-center">
        {[1, 2, 3].map((level) => (
          <View
            key={level}
            className={`w-1.5 h-3.5 rounded ${
              speedNum === 4
                ? "bg-purple-400"
                : speedNum >= level
                ? getSpeedBarColor(speedNum, level)
                : "bg-slate-600 opacity-25"
            }`}
          />
        ))}
      </View>
      <Text className={`text-sm font-semibold ${getSpeedLabelColor(speedNum)}`}>
        {getSpeedLabel(speedNum)}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default SpeedIndicator;

