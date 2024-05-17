import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { ConfirmationMoveStringEnum } from '@shared/components/ta-shared-modals/confirmation-move-modal/enums/confirmation-move-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';

@Pipe({
    name: 'confirmationMoveModalTitle',
    standalone: true,
})
export class ConfirmationMoveModalTitlePipe implements PipeTransform {
    transform(type: string, template: string): string {
        let titleString = '';
        if (type === ConfirmationMoveStringEnum.MOVE) {
            titleString = ConfirmationMoveStringEnum.MOVE_TITLE;
        } else {
            titleString = ConfirmationMoveStringEnum.REMOVE_TITLE;
        }

        titleString += ' ';

        if (template === TableStringEnum.BROKER) {
            titleString += ConfirmationMoveStringEnum.BROKER_TITLE;
        } else {
            titleString += template;
        }

        return titleString;
    }
}
