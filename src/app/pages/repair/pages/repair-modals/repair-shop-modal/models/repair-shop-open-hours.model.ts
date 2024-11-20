export interface OpenHours {
    dayOfWeek: string;
    isWorkingDay: boolean;
    // This is not needed yet on creating shop
    index: number;
    startTime: Date | string | null;
    endTime: Date | string| null;
    isDoubleShift: boolean,
    shifts?: {
        startTime: Date | string;
        endTime: Date | string;}[];
}