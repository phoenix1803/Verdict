import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, FONTS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';

export const ColdOpen = () => {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleBegin = () => {
    // In a real app we might check if we already have today's verdict generated
    navigation.reset({
      index: 0,
      routes: [{ name: 'TodayVerdict' }],
    });
  };

  return (
    <ScreenWrapper style={styles.center}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Text style={styles.title}>VERDICT</Text>
        <Text style={styles.subtitle}>A record of what actually happened.</Text>
      </Animated.View>

      {showButton && (
        <TouchableOpacity style={styles.button} onPress={handleBegin} activeOpacity={1}>
          <Text style={styles.buttonText}>BEGIN OBSERVATION</Text>
        </TouchableOpacity>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium as any,
    fontSize: 32,
    color: COLORS.burntOrange,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.regular as any,
    fontSize: 14,
    color: COLORS.amberOrange,
    textAlign: 'center',
    maxWidth: 300,
  },
  button: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium as any,
    fontSize: 16,
    color: COLORS.burntOrange,
    letterSpacing: 2,
  },
});
