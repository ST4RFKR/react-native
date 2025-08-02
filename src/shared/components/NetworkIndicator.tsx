import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useAppSelector } from '../../store';

const NetworkIndicator = () => {
  const isConnected = useAppSelector(state => state.app.isConnected);
  const opacityAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => pulse.stop();
  }, []);

  return (
    <Animated.View style={[
      styles.indicator,
      isConnected ? styles.connected : styles.disconnected,
      { opacity: opacityAnim }
    ]} />
  );
};

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 6,
    zIndex: 100,
  },
  connected: {
    backgroundColor: '#4CAF50',
  },
  disconnected: {
    backgroundColor: '#F44336',
  },
});

export default NetworkIndicator;
