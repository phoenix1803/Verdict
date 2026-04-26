import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export interface DailyVerdict {
  date: string; // YYYY-MM-DD
  narrative: string;
  verdictLine: string;
  metrics: any;
  timestamp: number;
}

export const StorageService = {
  saveVerdict: (verdict: DailyVerdict) => {
    const key = `verdict_${verdict.date}`;
    if (storage.contains(key)) {
      console.log('Verdict already exists, skipping write');
      return;
    }
    storage.set(key, JSON.stringify(verdict));
  },

  getVerdict: (date: string): DailyVerdict | null => {
    const key = `verdict_${date}`;
    const data = storage.getString(key);
    return data ? JSON.parse(data) : null;
  },

  getAllVerdicts: (): DailyVerdict[] => {
    const keys = storage.getAllKeys().filter(k => k.startsWith('verdict_'));
    return keys.map(k => JSON.parse(storage.getString(k)!)).sort((a, b) => b.timestamp - a.timestamp);
  }
};
