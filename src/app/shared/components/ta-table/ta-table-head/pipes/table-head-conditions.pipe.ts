import { Pipe, PipeTransform } from '@angular/core';

// models
import { TableHeadConditionData } from '@shared/components/ta-table/ta-table-head/models/table-head-condition-data.model';

@Pipe({ name: 'tableHeadConditions', standalone: true })
export class TableHeadConditionsPipe implements PipeTransform {
    transform(
        ngTemplate: string,
        conditionData: TableHeadConditionData
    ): boolean {
        switch (conditionData?.conditionType) {
            case 'selected-row-count':
                return (
                    ngTemplate === 'checkbox' || ngTemplate === 'user-checkbox'
                );
            case 'double-heading':
                return (
                    ![
                        'checkbox',
                        'sw-tw-total',
                        'citation',
                        'accident-citation',
                        'contact',
                    ].includes(ngTemplate) &&
                    conditionData?.name !== '' &&
                    conditionData?.title !== 'ft'
                );
            case 'heading-icon':
                return (
                    !['applicant-progress'].includes(ngTemplate) &&
                    !!conditionData?.headIconStyle &&
                    conditionData?.title === 'ft'
                );
            case 'heading':
                return ngTemplate === 'text' && conditionData?.title === 'ft';
            case 'sw-tw-heading':
                return ngTemplate === 'sw-tw-total';
            case 'citation':
                return ngTemplate === 'citation';
            case 'citation-icons':
                return ngTemplate === 'accident-citation';
            case 'icons':
                return (
                    !['applicant-progress'].includes(ngTemplate) &&
                    !!conditionData?.headIconStyle &&
                    conditionData?.title !== 'ft'
                );
            case 'sort':
                return (
                    !!conditionData?.sortDirection &&
                    conditionData?.sortDirection !== '' &&
                    conditionData?.sortable &&
                    conditionData?.locked &&
                    conditionData?.viewDataLength > 1
                );
            default:
                return false;
        }
    }
}
