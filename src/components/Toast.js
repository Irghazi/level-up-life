import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ToastContext = createContext(null);

const TOAST_TYPES = {
  success: {
    bg: '#ECFDF5',
    border: '#22C55E',
    icon: 'checkmark-circle',
    iconColor: '#22C55E',
    titleColor: '#15803D',
    msgColor: '#166534',
  },
  error: {
    bg: '#FEF2F2',
    border: '#EF4444',
    icon: 'close-circle',
    iconColor: '#EF4444',
    titleColor: '#B91C1C',
    msgColor: '#991B1B',
  },
  info: {
    bg: '#EFF6FF',
    border: '#3B82F6',
    icon: 'information-circle',
    iconColor: '#3B82F6',
    titleColor: '#1D4ED8',
    msgColor: '#1E40AF',
  },
  warning: {
    bg: '#FFFBEB',
    border: '#F59E0B',
    icon: 'warning',
    iconColor: '#F59E0B',
    titleColor: '#B45309',
    msgColor: '#92400E',
  },
};

const ToastItem = ({ id, type = 'info', title, message, onHide }) => {
  const slideAnim = useRef(new Animated.Value(-120)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  const theme = TOAST_TYPES[type] || TOAST_TYPES.info;

  React.useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar countdown
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 3500,
      useNativeDriver: false,
    }).start();

    // Auto hide after 3.5s
    const timer = setTimeout(() => hide(), 3500);
    return () => clearTimeout(timer);
  }, []);

  const hide = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -120,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide(id));
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          opacity: opacityAnim,
          backgroundColor: theme.bg,
          borderLeftColor: theme.border,
        },
      ]}
    >
      {/* Left accent border */}
      <View style={[styles.leftBar, { backgroundColor: theme.border }]} />

      {/* Icon */}
      <View style={[styles.iconWrapper, { backgroundColor: theme.border + '20' }]}>
        <Ionicons name={theme.icon} size={22} color={theme.iconColor} />
      </View>

      {/* Text */}
      <View style={styles.textWrapper}>
        {title ? <Text style={[styles.toastTitle, { color: theme.titleColor }]}>{title}</Text> : null}
        {message ? <Text style={[styles.toastMessage, { color: theme.msgColor }]}>{message}</Text> : null}
      </View>

      {/* Close button */}
      <TouchableOpacity onPress={hide} style={styles.closeBtn} activeOpacity={0.7}>
        <Ionicons name="close" size={16} color={theme.iconColor} />
      </TouchableOpacity>

      {/* Progress bar */}
      <Animated.View
        style={[
          styles.progressBar,
          { width: progressWidth, backgroundColor: theme.border },
        ]}
      />
    </Animated.View>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ type = 'info', title, message }) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev.slice(-2), { id, type, title, message }]);
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Shorthand methods
  const toast = {
    success: (title, message) => showToast({ type: 'success', title, message }),
    error: (title, message) => showToast({ type: 'error', title, message }),
    info: (title, message) => showToast({ type: 'info', title, message }),
    warning: (title, message) => showToast({ type: 'warning', title, message }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast overlay */}
      <View style={styles.toastOverlay} pointerEvents="box-none">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            id={t.id}
            type={t.type}
            title={t.title}
            message={t.message}
            onHide={hideToast}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const styles = StyleSheet.create({
  toastOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 55 : 45,
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    paddingLeft: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 10,
    overflow: 'hidden',
    borderLeftWidth: 4,
    gap: 10,
  },
  leftBar: {
    width: 0,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    flexShrink: 0,
  },
  textWrapper: {
    flex: 1,
    gap: 2,
  },
  toastTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  toastMessage: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 17,
  },
  closeBtn: {
    padding: 6,
    marginRight: 4,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    borderRadius: 2,
    opacity: 0.6,
  },
});
