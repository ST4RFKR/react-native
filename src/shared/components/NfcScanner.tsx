import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Vibration } from 'react-native';
import { Text, Button, IconButton, Card, useTheme } from 'react-native-paper';

interface NfcScannerProps {
  onTagRead: (tagId: string) => void;
  onCancel?: () => void;
}

const NfcScanner: React.FC<NfcScannerProps> = ({ onTagRead, onCancel }) => {
  const theme = useTheme();
  const [status, setStatus] = useState<'ready' | 'scanning' | 'success' | 'error'>('ready');
  const [tagId, setTagId] = useState<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Имитация сканирования NFC (замените на реальную NFC логику)
  const startScan = () => {
    setStatus('scanning');

    // Анимация пульсации
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Имитация обнаружения метки через 3 секунды
    setTimeout(() => {
      const simulatedTagId = `NFC-${Math.floor(Math.random() * 10000)}`;
      handleTagDetected(simulatedTagId);
    }, 3000);
  };

  const handleTagDetected = (id: string) => {
    Vibration.vibrate(100);
    setTagId(id);
    setStatus('success');

    // Анимация успешного сканирования
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => onTagRead(id), 1000);
    });
  };

  const handleError = () => {
    Vibration.vibrate([100, 100, 100]);
    setStatus('error');
  };

  const resetScanner = () => {
    setStatus('ready');
    setTagId(null);
    pulseAnim.setValue(0);
    scaleAnim.setValue(1);
  };

  const pulseInterpolation = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        {/* Заголовок */}
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            NFC Сканер
          </Text>
          {onCancel && (
            <IconButton
              icon="close"
              size={24}
              onPress={onCancel}
            />
          )}
        </View>

        {/* Анимированная иконка */}
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.circle,
              {
                backgroundColor: theme.colors.primaryContainer,
                transform: [{ scale: pulseInterpolation }],
                opacity: status === 'scanning' ? 0.3 : 0,
              },
            ]}
          />

          <Animated.View
            style={[
              styles.statusIcon,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            {status === 'success' && (
              <IconButton
                icon="check-circle"
                iconColor={theme.colors.primary}
                size={80}
              />
            )}
            {status === 'error' && (
              <IconButton
                icon="alert-circle"
                iconColor={theme.colors.error}
                size={80}
              />
            )}
          </Animated.View>
        </View>

        {/* Статус */}
        <View style={styles.statusContainer}>
          <Text variant="bodyLarge" style={styles.statusText}>
            {status === 'ready' && 'Піднесіть пристрій до NFC меткі'}
            {status === 'scanning' && 'Сканування...'}
            {status === 'success' && 'Мітка прочитана!'}
            {status === 'error' && 'Помилка сканування!'}
          </Text>

          {tagId && status === 'success' && (
            <Text variant="bodyMedium" style={styles.tagIdText}>
              ID: {tagId}
            </Text>
          )}
        </View>

        {/* Кнопки управления */}
        <View style={styles.buttonsContainer}>
          {status === 'ready' && (
            <Button
              mode="contained"
              onPress={startScan}
              style={styles.button}
              icon="nfc"
            >
              Почати сканування
            </Button>
          )}

          {(status === 'success' || status === 'error') && (
            <Button
              mode="outlined"
              onPress={resetScanner}
              style={styles.button}
            >
              Сканувати знову
            </Button>
          )}

          {status === 'scanning' && (
            <Button
              mode="outlined"
              onPress={handleError}
              style={styles.button}
              textColor={theme.colors.error}
            >
              Відмінити
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: 24,
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  statusIcon: {
    position: 'absolute',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 60,
  },
  statusText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  tagIdText: {
    textAlign: 'center',
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: 8,
    minWidth: 200,
  },
});

export default NfcScanner;