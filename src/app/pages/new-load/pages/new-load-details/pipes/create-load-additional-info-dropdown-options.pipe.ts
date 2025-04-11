import { Pipe, PipeTransform } from '@angular/core';

// enums
import { eLoadDetailsGeneral } from '@pages/new-load/enums';

// models
import { LoadResponse } from 'appcoretruckassist';
import { iDropdownItem } from 'ca-components';

@Pipe({
    name: 'createLoadAdditionalInfoDropdownOptions',
    standalone: true,
})
export class CreateLoadAdditionalInfoDropdownOptionsPipe
    implements PipeTransform
{
    transform(load: LoadResponse): iDropdownItem[] {
        let dropdownOptions: iDropdownItem[] = [];
        if (!load) return dropdownOptions;

        dropdownOptions = [
            {
                title: eLoadDetailsGeneral.COMMENTS,
                count: load.commentsCount,
                isSelected: false,
            },
            {
                title: eLoadDetailsGeneral.STATUS_LOG,
                count: load.statusHistory?.length,
                isSelected: false,
            },
        ];
        return dropdownOptions;
    }
}
