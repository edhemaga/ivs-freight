import type { TruckDetailsConfigData } from './truck-details-config-data.model';

export interface TruckDetailsConfig {
    id: number;
    name: string;
    template: string;
    data: TruckDetailsConfigData[];
    length?: number;
    status?: boolean;
    isExpired?: boolean;
    businessOpen?: boolean;
}
