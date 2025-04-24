import { Pipe, PipeTransform } from '@angular/core';

// enums
import { eLoadDetailsGeneral } from '@pages/new-load/enums';

// models
import { LoadResponse } from 'appcoretruckassist';
import { IDropdownItem } from 'ca-components';

@Pipe({
    name: 'createLoadAdditionalInfoDropdownOptions',
    standalone: true,
})
export class CreateLoadAdditionalInfoDropdownOptionsPipe
    implements PipeTransform
{
    transform(load: LoadResponse): IDropdownItem[] {
        let dropdownOptions: IDropdownItem[] = [];
        if (!load) return dropdownOptions;

        dropdownOptions = [
            {
                id: 1,
                title: eLoadDetailsGeneral.COMMENTS,
                count: load.commentsCount,
                isSelected: false,
            },
            {
                id: 2,
                title: eLoadDetailsGeneral.STATUS_LOG,
                count: load.statusHistory?.length,
                isSelected: false,
            },
        ];
        return dropdownOptions;
    }
}
