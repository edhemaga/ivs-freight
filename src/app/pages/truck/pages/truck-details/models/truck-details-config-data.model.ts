import type { FileResponse, StateResponse } from 'appcoretruckassist';

export interface TruckDetailsConfigDataModel {
    id?: number;
    issueDate?: string;
    expDate?: string;
    note?: string | null;
    files?: Array<FileResponse> | null;
    state?: StateResponse;
    licensePlate?: string | null;
    voidedOn?: string | null;
    number?: string | null;
    purchaseDate?: string;
}
