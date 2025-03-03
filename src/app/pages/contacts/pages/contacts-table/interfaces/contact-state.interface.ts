import {
    CompanyContactModalResponse,
    CompanyContactResponse,
    ContactColorResponse,
} from 'appcoretruckassist';

// enums
import { eActiveViewMode } from '@shared/enums';

export interface IContactState {
    data: CompanyContactResponse[];
    colors: ContactColorResponse[];

    modal: CompanyContactModalResponse;
    tableCount: number;

    selectedTab: string;
    activeViewMode: eActiveViewMode;
}
