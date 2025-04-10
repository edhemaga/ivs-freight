// Enums
import { eLoadModal } from '@pages/new-load/pages/new-load-modal/enums';
import {
    EnumValue,
    LoadRequirementsResponse,
    LoadResponse,
    LoadType,
} from 'appcoretruckassist';

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

    static generateInitalForm(
        load?: LoadResponse,
        loadRequirements?: LoadRequirementsResponse,
        isTemplate?: boolean
    ): UntypedFormGroup {
        return new UntypedFormGroup({
            name: new UntypedFormControl(
                null,
                isTemplate ? Validators.required : null
            ),
            dispatcherId: new UntypedFormControl(
                load?.dispatcher?.id ?? null,
                !isTemplate ? Validators.required : null
            ),
            companyId: new UntypedFormControl(
                load?.company?.id ?? null,
                Validators.required
            ),
            brokerId: new UntypedFormControl(
                load?.broker?.id ?? null,
                Validators.required
            ),
            referenceNumber: new UntypedFormControl(
                load?.referenceNumber ?? null,
                Validators.required
            ),
            baseRate: new UntypedFormControl(
                load?.baseRate ?? null,
                Validators.required
            ),
            dispatchId: new UntypedFormControl(load?.dispatch?.id ?? null),
            weight: new UntypedFormControl(load?.weight ?? null),
            generalCommodity: new UntypedFormControl(
                load?.generalCommodity?.id ?? null
            ),
            brokerContact: new UntypedFormControl(
                load?.brokerContact?.brokerId ?? null
            ),
            driverMessage: new UntypedFormControl(''),
            note: new UntypedFormControl(load?.note ?? null),
            statusType: new UntypedFormControl(load?.statusType?.name ?? null),
            status: new UntypedFormControl(load?.status?.statusString ?? null),
            loadRequirements:
                this.generateLoadRequirementsForm(loadRequirements),
        });
    }

    static generateLoadRequirementsForm(
        loadRequirements?: LoadRequirementsResponse
    ): UntypedFormGroup {
        return new UntypedFormGroup({
            id: new UntypedFormControl(loadRequirements?.id ?? null),
            trailerTypeId: new UntypedFormControl(
                loadRequirements?.trailerType?.id ?? null
            ),
            truckTypeId: new UntypedFormControl(
                loadRequirements?.truckType?.id ?? null
            ),
            trailerLengthId: new UntypedFormControl(
                loadRequirements?.trailerLength?.id ?? null
            ),
            doorType: new UntypedFormControl(
                loadRequirements?.doorType?.id ?? null
            ),
            suspension: new UntypedFormControl(
                loadRequirements?.suspension?.id ?? null
            ),
            year: new UntypedFormControl(loadRequirements?.year ?? null),
            liftgate: new UntypedFormControl(
                loadRequirements?.liftgate ?? null
            ),
        });
    }

    // TODO: Should we define return type? All the values should be inside form anyway?
    static generateLoadModel(id: number, loadForm: UntypedFormGroup): any {
        return {
            id,

            // We don't have LTL NOW, Hardcode
            type: LoadType.Ftl,

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
