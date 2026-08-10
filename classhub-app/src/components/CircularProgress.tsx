import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  labelProgress?: string | null;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 75,
  strokeWidth = 6,
  color,
  backgroundColor,
  label,
  labelProgress,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const { colors } = useTheme() as any;

  // Limita el progreso entre 0 y 100
  const clampedProgress = Math.max(0, Math.min(progress, 100));

  const strokeDashoffset =
    circumference - (circumference * clampedProgress) / 100;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Círculo de fondo */}
        <Circle
          stroke={colors.tertiary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* Círculo de progreso */}
        <Circle
          stroke={colors.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={styles.label}>
        <Text variant='labelSmall' style={[{ color: colors.titleColor, fontSize: 12 }]}>
            {labelProgress ?? `${labelProgress}`}
        </Text>

        { label &&
        <Text variant='bodySmall' style={[{ color: colors.titleColor, fontSize: 10}]}>
            {label ?? `${label}`}
        </Text>
        } 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    alignItems: 'center',
  },
});

export default CircularProgress;
