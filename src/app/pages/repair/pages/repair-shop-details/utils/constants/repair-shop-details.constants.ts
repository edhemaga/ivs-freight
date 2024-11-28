import { MultipleSelectDetailsDropdownItem } from '@shared/models/multiple-select-details-dropdown-item.model';

export class RepairShopDetailsConstants {
    static MULTIPLE_SELECT_DETAILS_DROPDOWN: MultipleSelectDetailsDropdownItem[] =
        [
            {
                id: 1,
                title: 'Contact',
                length: null,
                isActive: true,
            },
            {
                id: 2,
                title: 'Review',
                length: null,
                isActive: false,
            },
        ];
}
