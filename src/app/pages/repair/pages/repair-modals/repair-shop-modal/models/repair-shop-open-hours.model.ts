export interface OpenHours {
    dayLabel: string;
    isWorkingDay: boolean;
    // This is not needed yet on creating shop
    dayOfWeek: number;
    startTime: Date | null;
    endTime: Date | null;
}