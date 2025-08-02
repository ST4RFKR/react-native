import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';

const AnimatedButton = Animated.createAnimatedComponent(Button);

const MenuButtons = ({ navigation }: any) => {
  const theme = useTheme();
  const buttons = [
    {
      title: "Облік робочого часу",
      icon: "timer",
      screen: "TimeTracking",
      color: theme.colors.primary
    },
    {
      title: "Реєстрація техніки",
      icon: "car",
      screen: "RegisterTechnic",
      color: theme.colors.secondary
    },
    {
      title: "Синхронізація",
      icon: "sync",
      screen: "Sync",
      color: theme.colors.tertiary || '#4CAF50'
    }
  ];
  const scaleValues = buttons.map(() => new Animated.Value(1));

  const handlePressIn = (index: number) => {
    Animated.spring(scaleValues[index], {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(scaleValues[index], {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };



  return (
    <View style={styles.container}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Card.Content style={styles.cardContent}>
          {buttons.map((btn, index) => (
            <AnimatedButton
              key={index}
              mode="contained"
              icon={btn.icon}
              onPress={() => {
                navigation.navigate(btn.screen);
                handlePressOut(index);
              }}
              onPressIn={() => handlePressIn(index)}
              onPressOut={() => handlePressOut(index)}
              style={[
                styles.button,
                {
                  backgroundColor: btn.color,
                  transform: [{ scale: scaleValues[index] }]
                }
              ]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              theme={{ roundness: 10 }}
            >
              {btn.title}
            </AnimatedButton>
          ))}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  cardContent: {
    gap: 16,
    paddingVertical: 20,
  },
  button: {
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  buttonContent: {
    height: 52,
    paddingHorizontal: 20,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default MenuButtons;