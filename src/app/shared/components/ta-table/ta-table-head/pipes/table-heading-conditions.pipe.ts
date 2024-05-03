import { Pipe, PipeTransform } from '@angular/core';

// models
import { TableHeadingConditionData } from '@shared/components/ta-table/ta-table-head/models/table-heading-condition-data.model';

@Pipe({ name: 'tableHeadingConditions', standalone: true })
export class TableHeadingConditionsPipe implements PipeTransform {
    transform(
        ngTemplate: string,
        conditionData: TableHeadingConditionData
    ): boolean {
        switch (conditionData?.conditionType) {
            case 'double-heading':
                return (
                    ngTemplate !== 'checkbox' &&
                    ngTemplate !== 'applicant-progress' &&
                    ngTemplate !== 'sw-tw-total' &&
                    ngTemplate !== 'citation' &&
                    ngTemplate !== 'accident-citation' &&
                    conditionData?.name !== '' &&
                    conditionData?.title !== 'ft'
                );
            case 'heading-icon':
                return (
                    ngTemplate !== 'applicant-progress' &&
                    conditionData?.headIconStyle &&
                    conditionData?.title === 'ft'
                );
            case 'heading':
                return ngTemplate === 'text' && conditionData?.title === 'ft';
            case 'special-heading':
                return ngTemplate === 'applicant-progress';
            case 'sw-tw-heading':
                return ngTemplate === 'sw-tw-total';
            case 'citation':
                return ngTemplate === 'citation';
            case 'citation-icons':
                return ngTemplate === 'accident-citation';
            case 'icons':
                return (
                    ngTemplate !== 'applicant-progress' &&
                    conditionData?.headIconStyle &&
                    conditionData?.title !== 'ft'
                );
            case 'sort':
                return (
                    conditionData?.sortable &&
                    conditionData?.sortDirection !== '' &&
                    conditionData?.sortDirection &&
                    conditionData?.locked &&
                    conditionData?.viewDataLength > 1
                );
            default:
                break;
        }
    }
}
