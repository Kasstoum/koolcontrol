import React from "react";
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from "react-native-svg";

interface LogoProps {
  size?: number;
}

const Logo = ({ size = 40 }: LogoProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512" role="img" accessibilityLabel="KoolControl In-App Icon">
      <Defs>
        <ClipPath id="thermoClip">
          <Rect x="232" y="150" width="48" height="190" rx="24" />
        </ClipPath>
      </Defs>

      {/* Anneau thermostat - blanc pour bonne lisibilité */}
      <Circle
        cx="256"
        cy="256"
        r="150"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={30}
        strokeLinecap="round"
      />

      {/* Thermomètre : tige */}
      <Rect x="232" y="150" width="48" height="190" rx="24" fill="#FFFFFF" />

      {/* Bulbe */}
      <Circle cx="256" cy="340" r="34" fill="#FFFFFF" />

      {/* Niveau (orange pour contraste et lisibilité) */}
      <G clipPath="url(#thermoClip)" opacity={0.95}>
        <Path
          d="M220 258 C248 250 272 266 300 258 L300 380 L220 380 Z"
          fill="#F97316"
        />
      </G>
    </Svg>
  );
};

export default Logo;
