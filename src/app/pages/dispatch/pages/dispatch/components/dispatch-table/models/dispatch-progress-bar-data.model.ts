export interface DispatchProgressBarData {
    currentPosition?: number;
    mileageInfo?: string;
    currentStop?: DispatchProgressStopData;
    gpsTitle?: string;
    gpsIcon?: string;
    gpsInfo?: {
        gpsheading?: string;
        gpsTime?: string;
        gpsheadingColor?: string;
    };
    mileagesPercent?: string;
    totalMiles?: number;
    gpsLocationIcon?: string;
    gpsProgress?: DispatchProgressStopData[];
    dispatchStatus?: string;
}

export interface DispatchProgressStopData {
    type?: string;
    heading?: string;
    position?: number;
    location?: string;
    mileage?: string;
    data?: string;
    time?: string;
    latitude?: number;
    longitude?: number;
    legMiles?: number;
    stopNumber?: number;
    isAtStop?: boolean;
    currentWaitTime?: number;
    averageWaitTime?: { [key: string]: number; };
}
