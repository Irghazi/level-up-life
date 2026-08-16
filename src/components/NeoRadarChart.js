import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Polygon, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');

const NEO = {
  black: '#0D0D0D',
  white: '#FFFFFF',
  yellow: '#FFE500',
  red: '#FF3B30',
  blue: '#007AFF',
  orange: '#FF9500',
  green: '#34C759',
  cyan: '#5AC8FA',
  purple: '#9B5DE5',
};

const getTier = (val) => {
  if (val < 10) return { text: 'NOVICE', color: '#888888' };
  if (val < 40) return { text: 'ROOKIE', color: NEO.green };
  if (val < 60) return { text: 'AVERAGE', color: NEO.blue };
  if (val < 80) return { text: 'PRO', color: NEO.purple };
  if (val < 96) return { text: 'HEROIC', color: NEO.orange };
  return { text: 'DAVID GOGGINS', color: NEO.red };
};

const NeoRadarChart = ({ data, onStatPress }) => {
  // data = [ { id, label, val, color }, ... ] exactly 5 items
  // Ensure we have exactly 5, order: STR, VIT, CHA, INT, AGI
  const orderedKeys = ['str', 'vit', 'cha', 'int', 'agi'];
  
  // Create a map for quick lookup
  const dataMap = {};
  data.forEach(d => { dataMap[d.id] = d; });
  
  const chartData = orderedKeys.map(k => dataMap[k] || { id: k, label: k.toUpperCase(), val: 0, color: NEO.black });
  
  // Calculate max stat to scale the chart
  const maxStatVal = Math.max(100, ...chartData.map(s => s.val)); // Fix max to at least 100

  // SVG Config
  const containerSize = width; // Full width to prevent clipping touches on Android
  const center = containerSize / 2;
  const radius = containerSize * 0.25; // Chart radius

  // Angles for 5 points (Top, Top-Right, Bottom-Right, Bottom-Left, Top-Left)
  const angles = [
    -Math.PI / 2, // Top (STR)
    -Math.PI / 2 + (2 * Math.PI) / 5, // Top-Right (VIT)
    -Math.PI / 2 + (4 * Math.PI) / 5, // Bottom-Right (CHA)
    -Math.PI / 2 + (6 * Math.PI) / 5, // Bottom-Left (INT)
    -Math.PI / 2 + (8 * Math.PI) / 5, // Top-Left (AGI)
  ];

  // Helper to get X, Y
  const getPoint = (angle, r) => ({
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle)
  });

  // Calculate polygon points for the data
  const dataPoints = chartData.map((d, i) => {
    const scale = Math.min(Math.max(d.val / maxStatVal, 0.1), 1); // Min 10% so it's visible
    return getPoint(angles[i], radius * scale);
  });
  
  const dataPolygonString = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Calculate grid polygons (Background Webs)
  const gridLevels = [1, 0.8, 0.6, 0.4, 0.2];

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize }]}>
      {/* 1. SVG Graphics Layer */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width={containerSize} height={containerSize}>
          {/* Draw Web Polygons */}
          {gridLevels.map((level, idx) => {
            const points = angles.map(a => {
              const p = getPoint(a, radius * level);
              return `${p.x},${p.y}`;
            }).join(' ');
            return (
              <Polygon
                key={`grid-${idx}`}
                points={points}
                fill={idx === 0 ? NEO.white : 'none'}
                stroke={NEO.black}
                strokeWidth={2}
              />
            );
          })}
          
          {/* Draw Web Lines from Center */}
          {angles.map((a, idx) => {
            const end = getPoint(a, radius);
            return (
              <Line
                key={`line-${idx}`}
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke={NEO.black}
                strokeWidth={2}
              />
            );
          })}

          {/* Data Polygon */}
          <Polygon
            points={dataPolygonString}
            fill={NEO.yellow}
            fillOpacity={0.9}
            stroke={NEO.black}
            strokeWidth={3}
          />
        </Svg>
      </View>

      {/* 2. Absolute Text Labels Layer */}
      <View style={[StyleSheet.absoluteFill, { zIndex: 10 }]} pointerEvents="box-none">
        {chartData.map((stat, idx) => {
          const vertex = getPoint(angles[idx], radius);
          const tier = getTier(stat.val);
          
          let left = vertex.x - 50; // Center of the 100px container
          let top = vertex.y - 35; // Center of the 70px height

          // Precise manual push to ensure a 5-10px gap from the vertex
          if (idx === 0) { // STR (Top)
            top = vertex.y - 70 - 8;
          } else if (idx === 1) { // VIT (Top-Right)
            left = vertex.x - 25; // container center is at +25, so badge left edge is ~ +5
          } else if (idx === 4) { // AGI (Top-Left)
            left = vertex.x - 75; // container center is at -25, so badge right edge is ~ -5
          } else if (idx === 2) { // CHA (Bottom-Right)
            left = vertex.x - 30; 
            top = vertex.y + 12;
          } else if (idx === 3) { // INT (Bottom-Left)
            left = vertex.x - 70; 
            top = vertex.y + 12;
          }

          return (
            <TouchableOpacity
              key={`label-${idx}`}
              activeOpacity={0.7}
              onPress={() => onStatPress && onStatPress(stat)}
              style={[
                styles.labelContainer,
                {
                  left, 
                  top,
                  alignItems: 'center',
                }
              ]}
            >
            <View style={[styles.statBadge, { backgroundColor: stat.color }]}>
              <Text style={styles.statNameText}>{stat.label}</Text>
            </View>
            <Text style={styles.statValText}>{stat.val}</Text>
              <Text style={[styles.statTierText, { color: tier.color }]}>{tier.text}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginVertical: 20, // Add more margin to breathe
  },
  labelContainer: {
    position: 'absolute',
    width: 100, // Fixed width for alignment calculations
    height: 70, // Increased slightly for spacing
    justifyContent: 'center',
  },
  statBadge: {
    borderWidth: 1.5,
    borderColor: NEO.black,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    boxShadow: '2px 2px 0px #0D0D0D',
    marginBottom: 4,
  },
  statNameText: {
    color: NEO.white,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statValText: {
    fontSize: 22,
    fontWeight: '900',
    color: NEO.black,
    lineHeight: 24,
    marginTop: 2,
  },
  statTierText: {
    fontSize: 10,
    fontWeight: '900',
    textShadowColor: NEO.black,
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 0,
    marginTop: -2,
  },
});

export default NeoRadarChart;
