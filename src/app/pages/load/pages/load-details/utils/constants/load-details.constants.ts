import { MultipleSelectDetailsDropdownItem } from '@shared/models/multiple-select-details-dropdown-item.model';

export class LoadDetailsConstants {
    static MULTIPLE_SELECT_DETAILS_DROPDOWN: MultipleSelectDetailsDropdownItem[] =
        [
            {
                id: 1,
                title: 'Comment',
                length: null,
                isActive: true,
            },
            {
                id: 2,
                title: 'Status History',
                length: null,
                isActive: false,
            },
        ];
}
