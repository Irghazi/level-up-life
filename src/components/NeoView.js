import React from 'react';
import { View, StyleSheet } from 'react-native';

const NeoView = ({ children, style, innerStyle }) => {
  const flattened = StyleSheet.flatten(innerStyle) || {};
  let borderRadius = flattened.borderRadius !== undefined ? flattened.borderRadius : 8;
  
  // Force rounded-md (8) for all elements unless they are circles (e.g. radius > 16) or explicitly sharp (0)
  if (borderRadius < 16 && borderRadius !== 0) {
    borderRadius = 8;
  }

  return (
    <View style={[
      innerStyle,
      { borderRadius, backgroundColor: flattened.backgroundColor || '#FFFFFF', borderWidth: flattened.borderWidth !== undefined ? flattened.borderWidth : 2, borderColor: flattened.borderColor || '#0D0D0D' },
      {
        boxShadow: '2px 2px 0px #0D0D0D',
      },
      style
    ]}>
      {children}
    </View>
  );
};

export default NeoView;
