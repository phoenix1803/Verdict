import React from 'react';
import { SafeAreaView, StatusBar, View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export const ScreenWrapper = ({ children, style }: { children: React.ReactNode, style?: any }) => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
    <View style={[styles.content, style]}>{children}</View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
