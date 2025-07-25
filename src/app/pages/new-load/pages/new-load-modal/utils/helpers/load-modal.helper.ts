// Enums
import {
    eLoadModal,
    eLoadModalForm,
} from '@pages/new-load/pages/new-load-modal/enums';
import {
    EnumValue,
    LoadRequirementsResponse,
    LoadResponse,
    LoadStopResponse,
    LoadTemplateResponse,
    LoadType,
} from 'appcoretruckassist';

// Interfaces
import { ILoadModal } from '@pages/new-load/pages/new-load-modal/interfaces';

// Forms
import {
    FormArray,
    FormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

// Models
import { Tabs } from '@ca-shared/models/tabs.model';

// Helpers
import { LoadModalFormHelper } from '@pages/new-load/pages/new-load-modal/utils/helpers';
import { LoadModalStopsHelper } from '@pages/new-load/pages/new-load-modal/components/new-load-modal-stops/utils/helpers';

export class LoadModalHelper {
    static getLoadTypeTabs(): Tabs[] {
        return [
            {
                id: 1,
                name: 'FTL',
                checked: true,
            },
            {
                id: 2,
                name: 'LTL',
                checked: false,
            },
        ];
    }

    static generateTitle(editData: ILoadModal, statusType?: EnumValue): string {
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

    static createForm(
        isEdit: boolean,
        load?: LoadResponse,
        loadRequirements?: LoadRequirementsResponse,
        isTemplate?: boolean
    ): UntypedFormGroup {
        return new UntypedFormGroup({
            name: new UntypedFormControl(
                isTemplate ? (load as LoadTemplateResponse)?.name : null,
                isTemplate
                    ? [Validators.required, Validators.maxLength(24)]
                    : null
            ),
            dispatcherId: new UntypedFormControl(
                load?.dispatcher?.id ?? null,
                !isTemplate ? Validators.required : null
            ),
            companyId: new UntypedFormControl(
                load?.company?.id ?? null,
                isTemplate ? null : Validators.required
            ),
            brokerId: new UntypedFormControl(
                load?.broker?.id ?? null,
                isTemplate ? null : Validators.required
            ),
            referenceNumber: new UntypedFormControl(
                load?.referenceNumber ?? null,
                LoadModalFormHelper.referenceNumberValidators(isTemplate)
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
            note: new UntypedFormControl(load?.note ?? null),
            statusType: new UntypedFormControl(load?.statusType?.name ?? null),
            status: new UntypedFormControl(load?.status?.statusString ?? null),
            loadRequirements: this.generateLoadRequirementsForm(
                isEdit,
                loadRequirements
            ),
            invoicedDate: new UntypedFormControl(load?.invoicedDate),

            stops: new FormArray(
                LoadModalHelper.generateLoadStops(isEdit, load?.stops)
            ),
        });
    }

    static generateLoadRequirementsForm(
        isEdit: boolean,
        loadRequirements?: LoadRequirementsResponse
    ): UntypedFormGroup {
        return new UntypedFormGroup({
            id: new UntypedFormControl(
                isEdit ? (loadRequirements?.id ?? null) : null
            ),
            driverMessage: new UntypedFormControl(
                loadRequirements?.driverMessage ?? null
            ),
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

    static updateFormValidatorsForTemplate(
        loadForm: UntypedFormGroup,
        isTemplate: boolean
    ): void {
        const nameControl = loadForm.get(eLoadModalForm.NAME);
        const referenceNumberControl = loadForm.get(
            eLoadModalForm.REFERENCE_NUMBER
        );
        const dispatcherControl = loadForm.get(eLoadModalForm.DISPATCHER_ID);
        const companyId = loadForm.get(eLoadModalForm.COMPANY_ID);
        const brokerControl = loadForm.get(eLoadModalForm.BROKER_ID);

        if (nameControl) {
            nameControl.setValidators(isTemplate ? Validators.required : null);
            nameControl.updateValueAndValidity();
        }

        if (companyId) {
            companyId.setValidators(isTemplate ? null : Validators.required);
            companyId.updateValueAndValidity();
        }

        if (brokerControl) {
            brokerControl.setValidators(
                isTemplate ? null : Validators.required
            );
            brokerControl.updateValueAndValidity();
        }

        if (referenceNumberControl) {
            referenceNumberControl.setValidators(
                LoadModalFormHelper.referenceNumberValidators(isTemplate)
            );
            referenceNumberControl.reset();
        }

        if (dispatcherControl) {
            dispatcherControl.setValidators(
                !isTemplate ? Validators.required : null
            );
            dispatcherControl.updateValueAndValidity();
        }
    }

    static generateLoadStops(isEdit: boolean, stops: LoadStopResponse[]) {
        if (isEdit) {
            return stops.map((stop) =>
                LoadModalStopsHelper.createStop(new FormBuilder(), stop)
            );
        }

        // Create destination and origin stops
        return [
            LoadModalStopsHelper.createStop(new FormBuilder(), {
                stopType: {
                    id: 1,
                },
            }),
            LoadModalStopsHelper.createStop(new FormBuilder(), {
                stopType: {
                    id: 2,
                },
            }),
        ];
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
