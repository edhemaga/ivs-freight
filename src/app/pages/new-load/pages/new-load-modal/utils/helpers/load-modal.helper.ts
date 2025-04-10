// Enums
import { eLoadModal } from '@pages/new-load/pages/new-load-modal/enums';
import { EnumValue } from 'appcoretruckassist';

// Interfaces
import { ILoadModal } from '@pages/new-load/pages/new-load-modal/interfaces';

export class LoadModalHelper {
    static generateTitle(editData: ILoadModal, statusType: EnumValue): string {
        const { isEdit, isTemplate } = editData;

        if (isEdit) {
            if (isTemplate) return eLoadModal.EDIT_TEMPLATE_TITLE;

            switch (statusType.id) {
                case 1:
                    return eLoadModal.EDIT_PENDING_TITLE;
                case 2:
                    return eLoadModal.EDIT_ACTIVE_TITLE;
                case 3:
                    return eLoadModal.EDIT_CLOSED_TITLE;
            }
        }

        return isTemplate
            ? eLoadModal.CREATE_TEMPLATE_TITLE
            : eLoadModal.CREATE_TITLE;
    }

    static generateInitalForm() {
        return {
            dispatcherId: null,
            dispatchId: null,
            companyId: null,
            referenceNumber: null,
            brokerId: null,
            weight: null,
            generalCommodity: null,
            brokerContact: null,
            trailerLengthId: null,
            doorType: null,
            suspension: null,
            year: null,
            liftgate: null,
            trailerTypeId: null,
            truckTypeId: null,
            driverMessage: null,
            note: null,
        };
    }
}
