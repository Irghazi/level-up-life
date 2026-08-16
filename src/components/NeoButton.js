import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

const NeoButton = ({ children, style, innerStyle, onPress, disabled }) => {
  const flattened = StyleSheet.flatten(innerStyle) || {};
  let borderRadius = flattened.borderRadius !== undefined ? flattened.borderRadius : 8;
  
  if (borderRadius < 16 && borderRadius !== 0) {
    borderRadius = 8;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        innerStyle,
        { borderRadius, backgroundColor: flattened.backgroundColor || '#FFFFFF', borderWidth: flattened.borderWidth !== undefined ? flattened.borderWidth : 2, borderColor: flattened.borderColor || '#0D0D0D' },
        {
          boxShadow: '2px 2px 0px #0D0D0D',
        },
        style
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

export default NeoButton;
