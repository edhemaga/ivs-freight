import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { ConfirmationMoveStringEnum } from '@shared/components/ta-shared-modals/confirmation-move-modal/enums/confirmation-move-string.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';

@Pipe({
    name: 'confirmationMoveModalText',
    standalone: true,
})
export class ConfirmationMoveModalTextPipe implements PipeTransform {
    transform(type: string, template: string, subType: string): string {
        let fullTextString =
            ConfirmationModalStringEnum.ARE_YOU_SURE.toString() + ' ';
        let textStart = TableStringEnum.EMPTY_STRING_PLACEHOLDER.toString();
        let textMiddle = TableStringEnum.EMPTY_STRING_PLACEHOLDER.toString();
        let textEnd = TableStringEnum.EMPTY_STRING_PLACEHOLDER.toString();

        if (
            type === ConfirmationMoveStringEnum.MOVE ||
            type === ConfirmationMoveStringEnum.MULTIPLE_MOVE
        ) {
            textStart = ConfirmationMoveStringEnum.MOVE_SELECTED;
            textEnd = ConfirmationMoveStringEnum.TO + ' ';
        } else {
            textStart = ConfirmationMoveStringEnum.REMOVE_SELECTED;
            textEnd = ConfirmationMoveStringEnum.FROM + ' ';
        }

        if (
            type === ConfirmationMoveStringEnum.MULTIPLE_MOVE ||
            type === ConfirmationMoveStringEnum.MULTIPLE_REMOVE
        ) {
            textMiddle = template + 's';
        } else {
            textMiddle = template;
        }

        if (subType === ConfirmationMoveStringEnum.BAN) {
            textEnd += ConfirmationMoveStringEnum.BAN_LIST;
        } else {
            textEnd += ConfirmationMoveStringEnum.DNU_LIST;
        }

        textEnd += ConfirmationModalStringEnum.QUESTION_MARK;

        fullTextString += textStart + ' ' + textMiddle + ' ' + textEnd;

        return fullTextString;
    }
}
