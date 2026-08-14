import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.75)).current;
  const slideUpAnim = useRef(new Animated.Value(40)).current;
  const footerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 55,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Footer fades in slightly later
    setTimeout(() => {
      Animated.timing(footerFade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    }, 500);

    // Navigate to Login after 2.8 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Login');
      });
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#DCE4EE" />

      {/* Center Logo */}
      <Animated.View
        style={[
          styles.centerContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideUpAnim }],
          },
        ]}
      >
        <Image
          source={require('../../assets/logo_lul.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Footer — Trinity Gate logo */}
      <Animated.View style={[styles.footer, { opacity: footerFade }]}>
        <Image
          source={require('../../assets/logo_tg.png')}
          style={styles.footerLogo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCE4EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.65,
    height: width * 0.65,
  },
  footer: {
    paddingBottom: 44,
    alignItems: 'center',
  },
  footerLogo: {
    width: 160,
    height: 44,
  },
});

export default SplashScreen;
