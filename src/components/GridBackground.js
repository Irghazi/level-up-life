import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const GRID_SIZE = 32; // Size of grid squares in pixels
const numCols = Math.ceil(width / GRID_SIZE) + 1;
const numRows = Math.ceil(height / GRID_SIZE) + 2;

const GridBackground = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* Background Grid Lines Layer */}
      <View style={styles.gridLayer} pointerEvents="none">
        {/* Vertical Lines */}
        {Array.from({ length: numCols }).map((_, i) => (
          <View
            key={`v-${i}`}
            style={[
              styles.verticalLine,
              { left: i * GRID_SIZE },
            ]}
          />
        ))}

        {/* Horizontal Lines */}
        {Array.from({ length: numRows }).map((_, j) => (
          <View
            key={`h-${j}`}
            style={[
              styles.horizontalLine,
              { top: j * GRID_SIZE },
            ]}
          />
        ))}
      </View>

      {/* Screen Content */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  gridLayer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12, // Subtle graph paper grid lines
    zIndex: 0,
  },
  verticalLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#0D0D0D',
  },
  horizontalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#0D0D0D',
  },
});

export default GridBackground;
