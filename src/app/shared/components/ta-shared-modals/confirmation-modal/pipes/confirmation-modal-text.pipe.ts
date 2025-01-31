import { Pipe, PipeTransform } from '@angular/core';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { DropActionsStringEnum } from '@shared/enums/drop-actions-string.enum';
import { DropdownMenuStringEnum } from '@shared/enums';

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
                      DropActionsStringEnum.EMPTY_SPACE_STRING +
                      ConfirmationModalStringEnum.SELECTED_DRIVER
                    : subType;
            textMiddle = infoText;
        } else if (type === TableStringEnum.ACTIVATE) {
            const activateText =
                template === DropActionsStringEnum.CDL
                    ? type +
                      DropActionsStringEnum.EMPTY_SPACE_STRING +
                      ConfirmationModalStringEnum.SELECTED_DRIVER
                    : type +
                      DropActionsStringEnum.EMPTY_SPACE_STRING +
                      ConfirmationModalStringEnum.SELECTED;
            textMiddle = activateText;
        } else if (type === TableStringEnum.MULTIPLE_DELETE) {
            textMiddle = ConfirmationModalStringEnum.DELETE_SELECTED;
        } else {
            textMiddle =
                type +
                DropActionsStringEnum.EMPTY_SPACE_STRING +
                ConfirmationModalStringEnum.SELECTED;
        }

        if (template === TableStringEnum.REPAIR_2) {
            const repairText =
                type === TableStringEnum.MULTIPLE_DELETE
                    ? ConfirmationModalStringEnum.REPAIRS_ORDERS
                    : ConfirmationModalStringEnum.REPAIR_ORDER;
            textEnd =
                subType + DropActionsStringEnum.EMPTY_SPACE_STRING + repairText;
        } else if (
            template === TableStringEnum.REPAIR_SHOP ||
            template === TableStringEnum.REPAIR_SHOP_3
        ) {
            const repairText =
                type === TableStringEnum.MULTIPLE_DELETE
                    ? ConfirmationModalStringEnum.REPAIR_SHOPS
                    : ConfirmationModalStringEnum.REPAIR_SHOP;
            textEnd = repairText;
        } else if (template === TableStringEnum.REPAIR_DETAIL) {
            const repairText =
                subType === DropdownMenuStringEnum.ORDER
                    ? TableStringEnum.REPAIR_ORDER
                    : TableStringEnum.REPAIR_2;
            textEnd = repairText;
        } else if (template === TableStringEnum.DELETE_REVIEW) {
            if (subType === TableStringEnum.REPAIR_2) {
                textEnd = ConfirmationModalStringEnum.REPAIR_SHOP_REVIEW;
            } else if (subType === TableStringEnum.BROKER) {
                textEnd = ConfirmationModalStringEnum.BROKER_REVIEW;
            } else if (subType === TableStringEnum.SHIPPER) {
                textEnd = ConfirmationModalStringEnum.SHIPPER_REVIEW;
            }
        } else if (template === DropActionsStringEnum.CDL) {
            textEnd = DropActionsStringEnum.CDL_2;
        } else if (template === TableStringEnum.LOAD) {
            let loadText = TableStringEnum.EMPTY_STRING_PLACEHOLDER.toString();

            if (subType === TableStringEnum.TEMPLATE) {
                loadText =
                    TableStringEnum.LOAD +
                    DropActionsStringEnum.EMPTY_SPACE_STRING +
                    (type === TableStringEnum.MULTIPLE_DELETE
                        ? DropActionsStringEnum.TEMPLATES
                        : DropActionsStringEnum.TEMPLATE);
            } else {
                loadText =
                    subType +
                    DropActionsStringEnum.EMPTY_SPACE_STRING +
                    (type === TableStringEnum.MULTIPLE_DELETE
                        ? TableStringEnum.LOADS
                        : TableStringEnum.LOAD);
            }

            textEnd = loadText;
        } else if (type === TableStringEnum.MULTIPLE_DELETE) {
            textEnd = template + 's';
        } else if (template === DropActionsStringEnum.COMPANY_TERMINAL) {
            textEnd = DropActionsStringEnum.TERMINAL;
        } else if (template === DropActionsStringEnum.COMPANY_PARKING) {
            textEnd = DropActionsStringEnum.PARKING;
        } else if (template === DropActionsStringEnum.COMPANY_OFFICE) {
            textEnd = DropActionsStringEnum.OFFICE;
        } else if (template === DropActionsStringEnum.COMPANY_REPAIR_SHOP) {
            textEnd = DropActionsStringEnum.REPAIR_SHOP;
        } else if (template.includes(DropActionsStringEnum.FUEL)) {
            textEnd =
                subType === DropActionsStringEnum.DELETE_FUEL_TRANSACTION
                    ? DropActionsStringEnum.FUEL_TRANSACTION_TEXT
                    : DropActionsStringEnum.FUEL_STOP_TEXT;
        } else {
            textEnd = template;
        }

        textEnd += ConfirmationModalStringEnum.QUESTION_MARK;

        textString +=
            DropActionsStringEnum.EMPTY_SPACE_STRING +
            textMiddle +
            DropActionsStringEnum.EMPTY_SPACE_STRING +
            textEnd;

        return textString;
    }
}
