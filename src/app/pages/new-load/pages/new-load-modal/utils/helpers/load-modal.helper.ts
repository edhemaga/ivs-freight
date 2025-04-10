// Enums
import { eLoadModal } from '@pages/new-load/pages/new-load-modal/enums';
import { EnumValue } from 'appcoretruckassist';

// Interfaces
import { ILoadModal } from '@pages/new-load/pages/new-load-modal/interfaces';

// Forms
import {
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

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

    static generateInitalForm(): UntypedFormGroup {
        return new UntypedFormGroup({
            dispatcherId: new UntypedFormControl(null, Validators.required),
            companyId: new UntypedFormControl(null, Validators.required),
            brokerId: new UntypedFormControl(null, Validators.required),
            referenceNumber: new UntypedFormControl(null, Validators.required),
            baseRate: new UntypedFormControl(null, Validators.required),
            dispatchId: new UntypedFormControl(null),
            weight: new UntypedFormControl(null),
            generalCommodity: new UntypedFormControl(null),
            brokerContact: new UntypedFormControl(null),
            trailerLengthId: new UntypedFormControl(null),
            doorType: new UntypedFormControl(null),
            suspension: new UntypedFormControl(null),
            year: new UntypedFormControl(null),
            liftgate: new UntypedFormControl(null),
            trailerTypeId: new UntypedFormControl(null),
            truckTypeId: new UntypedFormControl(null),
            driverMessage: new UntypedFormControl(null),
            note: new UntypedFormControl(null),
            statusType: new UntypedFormControl(null),
            status: new UntypedFormControl(null),
        });
    }

    // TODO: Should we define return time? All the values should be inside form anyway?
    static generateLoadModel(id: number, loadForm: UntypedFormGroup): any {
        return {
            id,
            // TODO: HARDCODE VALUES SO WE CAN SAVE LOAD, FOR TESTING ONLY!!!
            additionalBillingRates: [
                { additionalBillingType: 1 },
                { additionalBillingType: 2 },
                { additionalBillingType: 3 },
                { additionalBillingType: 4 },
                { additionalBillingType: 5 },
            ],
            ...loadForm.value,
        };
    }
}
