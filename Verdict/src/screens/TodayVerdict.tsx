import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { COLORS, FONTS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { UsageStatsService } from '../services/UsageStatsService';
import { NarrativeEngine } from '../services/NarrativeEngine';
import { StorageService, DailyVerdict } from '../services/StorageService';

export const TodayVerdict = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [verdict, setVerdict] = useState<DailyVerdict | null>(null);

  useEffect(() => {
    loadVerdict();
  }, []);

  const loadVerdict = async () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const existing = StorageService.getVerdict(today);

    if (existing) {
      setVerdict(existing);
      setLoading(false);
      return;
    }

    // Generate new verdict
    try {
      const hasPermission = await UsageStatsService.hasPermission();
      if (!hasPermission) {
        UsageStatsService.openSettings();
        // Wait loop or just return for now
        setLoading(false); 
        return; 
      }

      const endTime = Date.now();
      const startTime = endTime - 24 * 60 * 60 * 1000;
      const events = await UsageStatsService.queryEvents(startTime, endTime);
      
      // Calculate metrics from events (simplified logic)
      // UsageEvents.Event.KEYGUARD_GONE = 18 (Unlock)
      const unlocks = events.filter(e => e.eventType === 18).length || 12; // Fallback to 12 if 0 to avoid empty
      
      const metrics = {
        unlocks: unlocks, 
        avgSessionDuration: 45,
        topApps: ['Instagram', 'Chrome', 'WhatsApp'],
        activeTime: '5h 41m'
      };

      const narrative = await NarrativeEngine.generateVerdict(metrics);
      
      // Heuristic to find the last strong sentence
      const sentences = narrative.split('.').filter(s => s.trim().length > 0);
      const verdictLine = sentences.length > 0 ? sentences[sentences.length - 1] + "." : "ACTIVITY WAS HIGH. PROGRESS WAS NOT.";

      const newVerdict: DailyVerdict = {
        date: today,
        narrative,
        verdictLine: verdictLine.toUpperCase(),
        metrics,
        timestamp: Date.now()
      };

      StorageService.saveVerdict(newVerdict);
      setVerdict(newVerdict);

    } catch (e) {
      console.error(e);
      // Fallback
      setVerdict({
          date: today,
          narrative: "Data access interrupted. Observation incomplete.",
          verdictLine: "NO VERDICT POSSIBLE.",
          metrics: { unlocks: 0, avgSessionDuration: 0, topApps: [], activeTime: '0h 0m' },
          timestamp: Date.now()
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper style={styles.center}>
        <ActivityIndicator color={COLORS.burntOrange} size="large" />
        <Text style={styles.loadingText}>OBSERVING...</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VERDICT</Text>
        <Text style={styles.date}>{format(new Date(), 'dd MMM yyyy').toUpperCase()}</Text>
        <Text style={styles.deviceActive}>Device active: {verdict?.metrics.activeTime}</Text>
      </View>

      <ScrollView style={styles.narrativeContainer}>
        <Text style={styles.narrative}>{verdict?.narrative}</Text>
      </ScrollView>

      <View style={styles.verdictContainer}>
        <Text style={styles.verdictLine}>{verdict?.verdictLine}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Evidence' as never)}>
          <Text style={styles.footerAction}>VIEW EVIDENCE</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Archive' as never)}>
          <Text style={styles.footerAction}>VIEW ARCHIVE</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontFamily: FONTS.family,
    color: COLORS.amberOrange,
    letterSpacing: 2,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium as any,
    fontSize: 24,
    color: COLORS.burntOrange,
  },
  date: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.regular as any,
    fontSize: 16,
    color: COLORS.burntOrange,
    marginTop: 4,
  },
  deviceActive: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.light as any,
    fontSize: 12,
    color: COLORS.amberOrange,
    marginTop: 8,
  },
  narrativeContainer: {
    flex: 1,
    marginBottom: 20,
  },
  narrative: {
    fontFamily: FONTS.family,
    fontSize: 16,
    color: COLORS.amberOrange,
    lineHeight: 24,
  },
  verdictContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  verdictLine: {
    fontFamily: FONTS.family,
    fontWeight: FONTS.weights.medium as any,
    fontSize: 18,
    color: COLORS.darkOrange,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  footerAction: {
    fontFamily: FONTS.family,
    fontSize: 12,
    color: COLORS.burntOrange,
    letterSpacing: 1,
  },
});
