import { ICaInput } from '@ca-shared/components/ca-input/config';

export class DetailsHeaderCardInputConfig {
    static dropdownListConfig: ICaInput = {
        name: 'Input Dropdown',
        type: 'text',
        isDropdown: true,
        dropdownWidthClass: 'w-col-366',
        textTransform: 'capitalize',
        blackInput: true,
        customClass: 'input-32-font-20 details-pages',
    };
}
