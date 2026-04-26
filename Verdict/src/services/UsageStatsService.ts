import { NativeModules } from 'react-native';

const { UsageStats } = NativeModules;

export interface UsageEvent {
    packageName: string;
    timestamp: number;
    eventType: number;
}

export const UsageStatsService = {
    hasPermission: (): Promise<boolean> => {
        return UsageStats.hasPermission();
    },

    openSettings: () => {
        UsageStats.openSettings();
    },

    queryEvents: (startTime: number, endTime: number): Promise<UsageEvent[]> => {
        return UsageStats.queryEvents(startTime, endTime);
    },
};
