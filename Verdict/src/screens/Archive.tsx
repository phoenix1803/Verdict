import React from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, FONTS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { StorageService } from '../services/StorageService';
import { format } from 'date-fns';

export const Archive = () => {
  const navigation = useNavigation();
  const verdicts = StorageService.getAllVerdicts();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.date}>{format(new Date(item.date), 'MMM dd').toUpperCase()}</Text>
      <Text style={styles.dash}>—</Text>
      <Text style={styles.verdict}>{item.verdictLine ? item.verdictLine.split(' ')[0] : 'UNKNOWN'}</Text> 
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
       <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
           <Text style={styles.backButton}>{'< BACK'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ARCHIVE</Text>
      </View>
      
      <FlatList
        data={verdicts}
        renderItem={renderItem}
        keyExtractor={item => item.date}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>NO RECORDS FOUND</Text>}
      />
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
  list: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  date: {
    fontFamily: FONTS.family,
    color: COLORS.amberOrange,
    fontSize: 16,
    width: 80,
  },
  dash: {
    color: COLORS.darkOrange,
    marginHorizontal: 10,
  },
  verdict: {
    fontFamily: FONTS.family,
    color: COLORS.burntOrange,
    fontSize: 16,
    fontWeight: FONTS.weights.medium as any,
  },
  empty: {
    fontFamily: FONTS.family,
    color: COLORS.charcoalBlack,
    textAlign: 'center',
    marginTop: 50,
  },
});
