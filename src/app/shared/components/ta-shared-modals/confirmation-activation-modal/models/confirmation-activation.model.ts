import { AddressResponse } from 'appcoretruckassist';

export interface ConfirmationActivation {
    template: string;
    type: string;
    modalTitle: string;
    modalSecondTitle?: string;
    tableType: string;
    subType: string;
    subTypeStatus: string;
    data: any;
    array?: any[];
    id: number;
    svg?: boolean;
    newLocation?: AddressResponse;
}
