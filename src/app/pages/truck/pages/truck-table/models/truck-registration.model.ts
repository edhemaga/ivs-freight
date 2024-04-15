import type { TruckAttachment } from '@pages/truck/pages/truck-table/models/truck-attachment.model';
import type { TruckState } from '@pages/truck/pages/truck-table/models/truck-state.model';

export interface TruckRegistration {
    id?: string;
    startDate: string;
    endDate: string;
    state: TruckState[];
    attachemts?: TruckAttachment[];
}
