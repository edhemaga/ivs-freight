// models
import { LoadBrokerInfo, LoadStatusResponse } from 'appcoretruckassist';

// interfaces
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

export interface IMappedLoad {
    id: number;
    edit: boolean;
    isSelected: boolean;
    loadNumber: string;
    status: LoadStatusResponse;
    tableDropdownContent: IDropdownMenuItem[];
    totalDue: number;
    broker: LoadBrokerInfo;
}
