import type { TruckAttachment } from './truck-attachment.model';

export interface TruckFHWA {
    id: string;
    start: string;
    end: string;
    file?: TruckAttachment[];
}
