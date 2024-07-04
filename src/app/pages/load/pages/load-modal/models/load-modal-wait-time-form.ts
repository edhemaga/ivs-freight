import { LoadStatusHistoryResponse } from 'appcoretruckassist';

export interface LoadModalWaitTimeFormField extends LoadStatusHistoryResponse {
    endTime: string;
    endDate: string;
    startDate: string;
    startTime: string;
}
