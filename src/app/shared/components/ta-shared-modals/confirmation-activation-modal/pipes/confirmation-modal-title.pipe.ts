import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

@Pipe({
    name: 'confirmationModalTitle',
    standalone: true,
})
export class ConfirmationModalTitlePipe implements PipeTransform {
    transform(type: string, template: string): string {
        let titleString = '';
        if (type === ConfirmationActivationStringEnum.OPEN) {
            titleString = ConfirmationActivationStringEnum.OPEN_TITLE;
        } else {
            titleString = ConfirmationActivationStringEnum.CLOSE_TITLE;
        }

        titleString += ' ';

        if (template === TableStringEnum.REPAIR_SHOP) {
            titleString += ConfirmationActivationStringEnum.REPAIR_SHOP_TITLE;
        } else {
            titleString += template;
        }

        return titleString;
    }
}
