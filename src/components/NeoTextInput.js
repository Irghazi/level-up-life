import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const NeoTextInput = ({ style, innerStyle, ...props }) => {
  const flattened = StyleSheet.flatten(innerStyle) || {};
  let borderRadius = flattened.borderRadius !== undefined ? flattened.borderRadius : 8;
  
  if (borderRadius < 16 && borderRadius !== 0) {
    borderRadius = 8;
  }

  return (
    <TextInput
      style={[
        innerStyle,
        { borderRadius, backgroundColor: flattened.backgroundColor || '#FFFFFF', borderWidth: flattened.borderWidth !== undefined ? flattened.borderWidth : 2, borderColor: flattened.borderColor || '#0D0D0D' },
        {
          boxShadow: '2px 2px 0px #0D0D0D',
        },
        style
      ]}
      placeholderTextColor="#888"
      {...props}
    />
  );
};

export default NeoTextInput;
