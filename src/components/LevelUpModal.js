import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const NEO = {
  black: '#0D0D0D',
  white: '#FFFFFF',
  green: '#00C853',
  yellow: '#FFE500',
  cyan: '#00B4D8',
};

const LevelUpModal = ({ visible, level, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.cardShadow}>
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Ionicons name="star" size={50} color={NEO.yellow} style={styles.starIcon} />
              </View>
              <Text style={styles.title}>LEVEL UP!</Text>
              <Text style={styles.subtitle}>Selamat! Kamu telah mencapai</Text>
              <Text style={styles.levelText}>Level {level}</Text>

              <TouchableOpacity style={styles.btnShadow} onPress={onClose} activeOpacity={0.85}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Lanjutkan Perjalanan</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: width * 0.85,
    alignItems: 'center',
  },
  cardShadow: {
    boxShadow: '2px 2px 0px #0D0D0D',
    width: '100%',
  },
  card: {
    backgroundColor: NEO.white,
    borderWidth: 3,
    borderColor: NEO.black,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 10,
  },
  starIcon: {
    textShadowColor: NEO.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: NEO.cyan,
    textShadowColor: NEO.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: NEO.black,
    marginBottom: 4,
    textAlign: 'center',
  },
  levelText: {
    fontSize: 28,
    fontWeight: '900',
    color: NEO.yellow,
    textShadowColor: NEO.black,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    marginBottom: 24,
  },
  btnShadow: {
    boxShadow: '2px 2px 0px #0D0D0D',
    width: '100%',
  },
  btn: {
    backgroundColor: NEO.green,
    borderWidth: 2.5,
    borderColor: NEO.black,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '900',
    color: NEO.black,
  },
});

export default LevelUpModal;
