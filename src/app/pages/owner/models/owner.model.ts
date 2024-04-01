import { EnumValue, TrailerResponse, TruckResponse } from 'appcoretruckassist';

export interface OwnerBodyResponse {
    id: number;
    type: string;
    data: OwnerTableBodyResponse;
}

export interface OwnerTableBodyResponse {
    id?: number;
    name?: string | null;
    ownerType?: EnumValue;
    trailerCount?: number;
    truckCount?: number;
    ssnEin?: string | null;
    phone?: string | null;
    email?: string | null;
    note?: string | null;
    bankName?: string | null;
    isSelected?: boolean | null;
    accountNumber?: string | null;
    routingNumber?: string | null;
    address?: string | null;
    fileCount?: number | null;
    trucks?: Array<TruckResponse> | null;
    trailers?: Array<TrailerResponse> | null;
}
