import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '../enums/confirmation-modal-string.enum';

@Pipe({
    name: 'confirmationModalText',
    standalone: true,
})
export class ConfirmationModalTextPipe implements PipeTransform {
    transform(type: string, template: string, subType?: string): string {
        let textString = ConfirmationModalStringEnum.ARE_YOU_SURE.toString();
        let textMiddle = TableStringEnum.EMPTY_STRING_PLACEHOLDER.toString();
        let textEnd = TableStringEnum.EMPTY_STRING_PLACEHOLDER.toString();

        if (type === TableStringEnum.INFO) {
            textMiddle = subType;
        } else if (type === TableStringEnum.MULTIPLE_DELETE) {
            textMiddle = ConfirmationModalStringEnum.DELETE_SELECTED;
        } else {
            textMiddle = type + ' ' + ConfirmationModalStringEnum.SELECTED;
        }

        if (template === TableStringEnum.REPAIR_2) {
            const repairText =
                type === TableStringEnum.MULTIPLE_DELETE
                    ? ConfirmationModalStringEnum.REPAIRS_ORDERS
                    : ConfirmationModalStringEnum.REPAIR_ORDER;
            textEnd = subType + ' ' + repairText;
        } else if (template === TableStringEnum.REPAIR_SHOP) {
            const repairText =
                type === TableStringEnum.MULTIPLE_DELETE
                    ? ConfirmationModalStringEnum.REPAIR_SHOPS
                    : ConfirmationModalStringEnum.REPAIR_SHOP;
            textEnd = repairText;
        } else if (template === TableStringEnum.REPAIR_DETAIL) {
            const repairText =
                subType === TableStringEnum.ORDER
                    ? TableStringEnum.REPAIR_ORDER
                    : TableStringEnum.REPAIR_2;
            textEnd = repairText;
        } else if (template === TableStringEnum.REPAIR_REVIEW) {
            textEnd = ConfirmationModalStringEnum.REPAIR_SHOP_REVIEW;
        } else if (type === TableStringEnum.MULTIPLE_DELETE) {
            textEnd = template + 's';
        } else {
            textEnd = template;
        }

        textEnd += ConfirmationModalStringEnum.QUESTION_MARK;

        textString += ' ' + textMiddle + ' ' + textEnd;

        return textString;
    }
}
