import { IMultipleSelectDetailsDropdownItem } from '@pages/new-load/interfaces';

export class LoadDetailsConstants {
    static MULTIPLE_SELECT_DETAILS_DROPDOWN: IMultipleSelectDetailsDropdownItem[] =
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
