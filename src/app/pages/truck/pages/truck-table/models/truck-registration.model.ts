import type { TruckAttachment } from './truck-attachment.model';
import type { TruckState } from './truck-state.model';

export interface TruckRegistration {
    id?: string;
    startDate: string;
    endDate: string;
    state: TruckState[];
    attachemts?: TruckAttachment[];
}
