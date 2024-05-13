import type { TruckAttachment } from '@pages/truck/pages/truck-table/models/truck-attachment.model';

export interface TruckFHWA {
    id: string;
    start: string;
    end: string;
    file?: TruckAttachment[];
}
