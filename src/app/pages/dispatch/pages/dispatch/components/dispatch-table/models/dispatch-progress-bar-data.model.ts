import { IGpsProgress } from 'ca-components/lib/components/ca-progress-bar/models/gps-progress.model';

export interface DispatchProgressBarData {
    currentPosition?: number;
    mileageInfo?: string;
    currentStop?: IGpsProgress;
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
    gpsProgress?: IGpsProgress[];
    dispatchStatus?: string;
}