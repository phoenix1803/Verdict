import React from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, FONTS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';

export const Evidence = () => {
  const navigation = useNavigation();

  // Mock data - should be retrieved from StorageService or passed via params
  const data = {
    unlocks: 63,
    avgSession: '41s',
    repeatedContexts: ['Instagram', 'Chrome', 'WhatsApp'],
    longestIdle: '3m 12s'
  };

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
           <Text style={styles.backButton}>{'< BACK'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>EVIDENCE</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.item}>
          <Text style={styles.value}>UNLOCK EVENTS: {data.unlocks}</Text>
          <Text style={styles.commentary}>(MOST WITHOUT FOLLOW-UP)</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.value}>AVERAGE SESSION: {data.avgSession}</Text>
          <Text style={styles.commentary}>(INSUFFICIENT FOR COMPLETION)</Text>
        </View>

        <View style={styles.item}>
          <Text style={styles.value}>REPEATED CONTEXTS:</Text>
          {data.repeatedContexts.map((app, index) => (
            <Text key={index} style={styles.listValue}>{app}</Text>
          ))}
        </View>

        <View style={styles.item}>
          <Text style={styles.value}>LONGEST IDLE SCROLL:</Text>
          <Text style={styles.value}>{data.longestIdle}</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    fontFamily: FONTS.family,
    color: COLORS.burntOrange,
    fontSize: 14,
    marginRight: 20,
  },
  title: {
    fontFamily: FONTS.family,
    color: COLORS.burntOrange,
    fontSize: 20,
    fontWeight: FONTS.weights.medium as any,
  },
  content: {
    paddingBottom: 40,
  },
  item: {
    marginBottom: 30,
  },
  value: {
    fontFamily: FONTS.family,
    color: COLORS.darkOrange,
    fontSize: 18,
    marginBottom: 4,
  },
  commentary: {
    fontFamily: FONTS.family,
    color: COLORS.amberOrange,
    fontSize: 14,
    opacity: 0.8,
  },
  listValue: {
    fontFamily: FONTS.family,
    color: COLORS.amberOrange,
    fontSize: 16,
    marginLeft: 10,
  },
});
