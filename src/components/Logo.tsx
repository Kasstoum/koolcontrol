import React from "react";
import { View } from "react-native";

interface LogoProps {
  size?: number;
}

const Logo = ({ size = 40 }: LogoProps) => {
  const center = size / 2;
  const halfWidth = size * 0.5;
  
  return (
    <View style={{ width: size, height: size }} className="relative items-center justify-center">
      {/* Fond bleu avec coins arrondis */}
      <View 
        className="absolute rounded-xl bg-blue-500"
        style={{ width: size, height: size }}
      />
      
      {/* Left side - Heating (red/orange) */}
      <View 
        className="absolute rounded-l-xl"
        style={{ 
          width: halfWidth, 
          height: size * 0.7,
          top: size * 0.15,
          left: 0,
          backgroundColor: '#F97316', // Orange for hot
        }}
      />
      
      {/* Upward arrow (hot) - left side */}
      <View 
        className="absolute"
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.08,
          borderRightWidth: size * 0.08,
          borderBottomWidth: size * 0.12,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: '#FFFFFF',
          top: size * 0.25,
          left: size * 0.15,
        }}
      />
      
      {/* Heat lines (left side) */}
      <View 
        className="absolute bg-white/60 rounded-full"
        style={{
          width: size * 0.15,
          height: 1.5,
          top: size * 0.35,
          left: size * 0.1,
        }}
      />
      <View 
        className="absolute bg-white/60 rounded-full"
        style={{
          width: size * 0.12,
          height: 1.5,
          top: size * 0.42,
          left: size * 0.1,
        }}
      />
      
      {/* Right side - Cooling (blue) */}
      <View 
        className="absolute rounded-r-xl"
        style={{ 
          width: halfWidth, 
          height: size * 0.7,
          top: size * 0.15,
          right: 0,
          backgroundColor: '#38BDF8', // Blue for cold
        }}
      />
      
      {/* Downward arrow (cold) - right side */}
      <View 
        className="absolute"
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.08,
          borderRightWidth: size * 0.08,
          borderTopWidth: size * 0.12,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: '#FFFFFF',
          top: size * 0.5,
          right: size * 0.15,
        }}
      />
      
      {/* Snowflakes/cold waves (right side) */}
      <View 
        className="absolute bg-white/60 rounded-full"
        style={{
          width: 1.5,
          height: size * 0.1,
          top: size * 0.35,
          right: size * 0.2,
        }}
      />
      <View 
        className="absolute bg-white/60 rounded-full"
        style={{
          width: 1.5,
          height: size * 0.08,
          top: size * 0.48,
          right: size * 0.25,
        }}
      />
      
      {/* Central separation line */}
      <View 
        className="absolute bg-white/40"
        style={{
          width: 1.5,
          height: size * 0.7,
          top: size * 0.15,
          left: center - 0.75,
        }}
      />
    </View>
  );
};

export default Logo;

