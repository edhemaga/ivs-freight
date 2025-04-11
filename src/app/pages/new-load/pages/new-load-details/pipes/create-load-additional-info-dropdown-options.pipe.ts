import { Pipe, PipeTransform } from '@angular/core';

// models
import { LoadResponse } from 'appcoretruckassist';
import { iDropdownItem } from 'ca-components/lib/components/ca-toolbar-dropdown/interfaces';

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
                title: 'Comments',
                count: load.commentsCount,
                isSelected: false,
            },
            {
                title: 'Status Log',
                count: load.statusHistory?.length,
                isSelected: false,
            },
        ];
        return dropdownOptions;
    }
}
