// models
import { LoadStatusResponse } from 'appcoretruckassist';

// interfaces
import { IDropdownMenuItem } from '@ca-shared/components/ca-dropdown-menu/interfaces';

export interface IMappedLoad {
    loadNumber: string;
    id: number;
    status: LoadStatusResponse;
    tableDropdownContent: IDropdownMenuItem[];
}
