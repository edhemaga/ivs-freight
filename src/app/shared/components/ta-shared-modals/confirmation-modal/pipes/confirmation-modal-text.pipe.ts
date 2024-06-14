import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { DropActionsStringEnum } from '@shared/enums/drop-actions-string.enum';

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
            const infoText =
                subType === DropActionsStringEnum.VOID_CDL
                    ? DropActionsStringEnum.VOID +
                      ' ' +
                      ConfirmationModalStringEnum.SELECTED_DRIVER
                    : subType;
            textMiddle = infoText;
        } else if (type === TableStringEnum.ACTIVATE) {
            const activateText =
                template === DropActionsStringEnum.CDL
                    ? type + ' ' + ConfirmationModalStringEnum.SELECTED_DRIVER
                    : type + ' ' + ConfirmationModalStringEnum.SELECTED;
            textMiddle = activateText;
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
        } else if (template === DropActionsStringEnum.CDL) {
            textEnd = DropActionsStringEnum.CDL_2;
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
