import { Pipe, PipeTransform } from '@angular/core';
import { TableStringEnum } from '@shared/enums/table-string.enum';

@Pipe({
    name: 'confirmationModalText',
    standalone: true,
})
export class ConfirmationModalTextPipe implements PipeTransform {
    transform(type: string, template: string, subType?: string): string {
        let textString = 'Are you sure you want to';
        let textMiddle = '';
        let textEnd = '';

        if (type === TableStringEnum.INFO) {
            textMiddle = subType;
        } else if (type === TableStringEnum.MULTIPLE_DELETE) {
            textMiddle = 'delete selected';
        } else {
            textMiddle = type + ' selected';
        }

        if (template === TableStringEnum.REPAIR_2) {
            const repairText =
                type === TableStringEnum.MULTIPLE_DELETE
                    ? 'repairs / orders'
                    : 'repair / order';
            textEnd = subType + ' ' + repairText;
        } else if (template === TableStringEnum.REPAIR_SHOP) {
            const repairText =
                type === TableStringEnum.MULTIPLE_DELETE
                    ? 'repair shops'
                    : 'repair shop';
            textEnd = repairText;
        } else if (type === TableStringEnum.MULTIPLE_DELETE) {
            textEnd = template + 's';
        } else {
            textEnd = template;
        }

        textEnd += '?';

        textString += ' ' + textMiddle + ' ' + textEnd;

        return textString;
    }
}
