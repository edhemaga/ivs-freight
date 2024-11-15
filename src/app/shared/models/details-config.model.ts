import { LoadsSortDropdownModel } from '@pages/customer/models/loads-sort-dropdown.model';
import { MultipleSelectDetailsDropdownItem } from '@pages/load/pages/load-details/components/load-details-item/models/multiple-select-details-dropdown-item.model';
import {
    CdlResponse,
    DriverResponse,
    MedicalResponse,
    MvrResponse,
    TestResponse,
} from 'appcoretruckassist';

export interface DetailsConfig {
    id?: number;
    name?: string;
    template?: string;
    req?: boolean;
    status?: boolean;
    statusType?: string;
    hasDanger?: boolean;
    length?: number | string;
    hide?: boolean;
    hasArrow?: boolean;
    capsulaText?: boolean | string;
    isMapBtn?: boolean;
    isMapDisplayed?: boolean;
    hasMultipleDetailsSelectDropdown?: boolean;
    multipleDetailsSelectDropdown?: MultipleSelectDetailsDropdownItem[];
    isSearchBtn?: boolean;
    nameDefault?: string;
    icon?: boolean;
    hasDateArrow?: boolean;
    hasArrowDown?: boolean;
    hasCost?: boolean;
    brokerLoadDrop?: boolean;
    customText?: string;
    total?: number;
    hasSearch?: boolean;
    searchPlaceholder?: string;
    timeFilter?: boolean;
    dispatcherFilter?: boolean;
    statusFilter?: boolean;
    locationFilter?: boolean;
    areaFilter?: boolean;
    moneyFilter?: boolean;
    hasSort?: boolean;
    sortDropdown?: LoadsSortDropdownModel[];
    isClosedBusiness?: boolean;
    data?:
        | DriverResponse
        | CdlResponse
        | TestResponse
        | MedicalResponse
        | MvrResponse;
}
