// models
import { CompanyUserShortResponse, LoadStatusResponse, LoadBrokerInfo, LoadDriverInfo } from 'appcoretruckassist';

// interfaces
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

export interface IMappedLoad {
    id: number;
    edit: boolean;
    isSelected: boolean;
    loadNumber: string;
    status: LoadStatusResponse;
    dispatcher: CompanyUserShortResponse;
    referenceNumber: string;
    tableDropdownContent: IDropdownMenuItem[];
    totalDue: number;
    broker: LoadBrokerInfo;
    driverInfo: LoadDriverInfo;
    invoicedDate: string;
}
