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
}

interface DispatchProgressStopData {
    type?: string;
    heading?: string;
    position?: number;
    location?: string;
    mileage?: string;
    time?: string;
}
