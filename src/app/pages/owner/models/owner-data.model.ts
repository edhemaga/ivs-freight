import { OwnerTableBodyResponse } from "./owner-body.model";

export interface OwnerBodyResponse {
    id: number;
    type: string;
    data: OwnerTableBodyResponse;
}