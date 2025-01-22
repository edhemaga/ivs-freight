import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

@Pipe({
    name: 'confirmationModalTitle',
    standalone: true,
})
export class ConfirmationModalTitlePipe implements PipeTransform {
    transform(type: string, subType: string): string {
        let titleString = '';

        if (type === ConfirmationActivationStringEnum.OPEN) {
            titleString = ConfirmationActivationStringEnum.OPEN_TITLE;
        } else if (
            type === TableStringEnum.DEACTIVATE ||
            type === TableStringEnum.DEACTIVATE_MULTIPLE
        ) {
            titleString = TableStringEnum.DEACTIVATE_2;
        } else if (
            type === TableStringEnum.ACTIVATE ||
            type === TableStringEnum.ACTIVATE_MULTIPLE
        ) {
            titleString = TableStringEnum.ACTIVATE_2;
        } else if (type === TableStringEnum.STATUS) {
            titleString = TableStringEnum.CHANGE;
        } else {
            titleString = ConfirmationActivationStringEnum.CLOSE_TITLE;
        }

        titleString += ' ';

        if (subType === TableStringEnum.REPAIR_SHOP) {
            titleString += ConfirmationActivationStringEnum.REPAIR_SHOP_TITLE;
        } else if (subType === TableStringEnum.TRUCK) {
            titleString += TableStringEnum.TRUCK_2;
        } else {
            titleString += subType;
        }

        return titleString;
    }
}
