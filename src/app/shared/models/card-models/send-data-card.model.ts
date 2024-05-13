import { CardDetails } from '@shared/models/card-models/card-table-data.model';

export interface SendDataCard {
    id?: number;
    data?: CardDetails;
    type: string;
    subType?: string;
}
