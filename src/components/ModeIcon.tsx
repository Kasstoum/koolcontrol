import React from "react";
import { View, Text } from "react-native";

interface ModeIconProps {
  mode: "1" | "2";
  size?: number;
}

const ModeIcon = ({ mode, size = 16 }: ModeIconProps) => {
  if (mode === "1") {
    // Snowflake (Cooling) - simplified version
    return (
      <View style={{ width: size, height: size }} className="items-center justify-center">
        {/* Croix principale */}
        <View className="absolute" style={{ width: size * 0.5, height: 1.5, backgroundColor: "#60A5FA" }} />
        <View className="absolute" style={{ width: 1.5, height: size * 0.5, backgroundColor: "#60A5FA" }} />
        {/* Diagonales */}
        <View 
          className="absolute" 
          style={{ 
            width: size * 0.35, 
            height: 1.5, 
            backgroundColor: "#60A5FA",
            transform: [{ rotate: '45deg' }],
          }} 
        />
        <View 
          className="absolute" 
          style={{ 
            width: size * 0.35, 
            height: 1.5, 
            backgroundColor: "#60A5FA",
            transform: [{ rotate: '-45deg' }],
          }} 
        />
      </View>
    );
  } else {
    // Flame (Heating) - simplified version
    return (
      <View style={{ width: size, height: size }} className="items-center justify-center">
        {/* Base de la flamme */}
        <View 
          className="absolute"
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: size * 0.3,
            borderRightWidth: size * 0.3,
            borderTopWidth: size * 0.5,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: '#F97316',
            bottom: 0,
          }}
        />
        {/* Corps principal de la flamme */}
        <View 
          className="absolute"
          style={{
            width: size * 0.6,
            height: size * 0.7,
            backgroundColor: '#F97316',
            borderRadius: size * 0.3,
            bottom: size * 0.05,
          }}
        />
        {/* Pointe de la flamme (plus claire) */}
        <View 
          className="absolute"
          style={{
            width: size * 0.35,
            height: size * 0.45,
            backgroundColor: '#FB923C',
            borderRadius: size * 0.2,
            top: 0,
          }}
        />
        {/* Yellow center */}
        <View 
          className="absolute"
          style={{
            width: size * 0.3,
            height: size * 0.4,
            backgroundColor: '#FBBF24',
            borderRadius: size * 0.15,
            top: size * 0.05,
          }}
        />
      </View>
    );
  }
};

export default ModeIcon;

