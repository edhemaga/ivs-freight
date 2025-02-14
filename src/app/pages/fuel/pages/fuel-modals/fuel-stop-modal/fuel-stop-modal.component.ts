import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { of, Subject, switchMap, takeUntil } from 'rxjs';

// helpers
import {
    addressValidation,
    businessNameValidation,
    fuelStopValidation,
    fuelStoreValidation,
    phoneFaxRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';
import { FuelService } from '@shared/services/fuel.service';
import { AddressService } from '@shared/services/address.service';

// models
import { AddressEntity } from 'appcoretruckassist';
import { FuelStopResponse, GetFuelStopModalResponse } from 'appcoretruckassist';
import { FileEvent } from '@shared/models';

// cmponents
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { CaInputAddressDropdownComponent } from 'ca-components';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// mixin
import { AddressMixin } from '@shared/mixins/address/address.mixin';

// Enums
import { EFileFormControls, eGeneralActions } from '@shared/enums';

@Component({
    selector: 'app-fuel-stop-modal',
    templateUrl: './fuel-stop-modal.component.html',
    styleUrls: ['./fuel-stop-modal.component.scss'],
    providers: [ModalService],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // components
        TaModalComponent,
        TaInputComponent,
        CaInputAddressDropdownComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,
        TaUploadFilesComponent,
        TaInputDropdownComponent,
    ],
})
export class FuelStopModalComponent
    extends AddressMixin(
        class {
            addressService!: AddressService;
        }
    )
    implements OnDestroy, OnInit
{
    @Input() editData: any;

    public destroy$ = new Subject<void>();

    public fuelStopForm: UntypedFormGroup;

    public isFormDirty: boolean;
    public isFavouriteFuelStop: boolean = false;
    public isCardAnimationDisabled: boolean = false;

    public companyId: number;

    public fuelStopName: string;
    public fuelStops: FuelStopResponse[] = [];

    public selectedFuelStop: FuelStopResponse;
    public selectedAddress: AddressEntity;

    // documents
    public documents: any[] = [];
    public filesForDelete: any[] = [];
    public fileModified: boolean = false;

    public longitude: number;
    public latitude: number;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // services
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService,
        private fuelService: FuelService,
        public addressService: AddressService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();

        this.getModalDropdowns();

        this.trackFuelStopPhone();

        this.trackFuelStopFranchise();
    }

    private createForm() {
        this.fuelStopForm = this.formBuilder.group({
            businessName: [null, [...businessNameValidation]],
            fuelStopFranchiseId: [
                null,
                [Validators.required, ...fuelStopValidation],
            ],
            store: [null, fuelStoreValidation],
            favourite: [false],
            phone: [null, [Validators.required, phoneFaxRegex]],
            fax: [null, phoneFaxRegex],
            address: [null, [Validators.required, ...addressValidation]],
            note: [null],
            files: [null],
        });
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case eGeneralActions.CLOSE:
                break;
            case 'save':
                if (this.fuelStopForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.fuelStopForm);
                    return;
                }

                if (this.editData) {
                    this.updateFuelStop(this.editData.id);

                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addFuelStop();

                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            default:
                break;
        }
    }

    public favouriteFuelStop(): void {
        this.isFavouriteFuelStop = !this.isFavouriteFuelStop;

        this.fuelStopForm.get('favourite').patchValue(this.isFavouriteFuelStop);
    }

    public onSelectDropdown(event: any, action): void {
        switch (action) {
            case 'fuel-stop':
                this.selectedFuelStop = event;

                if (event) {
                    this.fuelStopForm
                        .get('store')
                        .setValidators([
                            Validators.required,
                            ...fuelStoreValidation,
                        ]);

                    this.fuelStopForm.get('store').updateValueAndValidity();
                } else {
                    this.fuelStopForm.get('store').clearValidators();
                }

                break;
            default:
                break;
        }
    }

    public onSaveNewFuelStop(event: any): void {
        this.fuelStopForm.get('businessName').patchValue(event.data.name);
        this.fuelStopForm.get('fuelStopFranchiseId').clearValidators();
        this.fuelStopForm.get('fuelStopFranchiseId').patchValue(null);

        this.selectedFuelStop = null;

        this.fuelStopForm
            .get('businessName')
            .setValidators([Validators.required, ...businessNameValidation]);
    }

    public clearNewFuelStop(): void {
        this.fuelStopForm.get('businessName').patchValue(null);
        this.fuelStopForm.get('businessName').clearValidators();
        this.fuelStopForm.get('fuelStopFranchiseId').patchValue(null);

        this.selectedFuelStop = null;
    }

    public onHandleAddress(event: {
        address: AddressEntity | any;
        valid: boolean;
        longLat: any;
    }): void {
        if (event.valid) {
            this.selectedAddress = event.address;

            this.longitude = event.longLat.longitude;
            this.latitude = event.longLat.latitude;
        }

        if (this.selectedAddress)
            this.trackFuelStopAddress(this.selectedAddress);
    }

    public paginationPage(pageIndex: number): void {
        this.getModalDropdowns(pageIndex, 25);
    }

    public onFilesEvent(event: FileEvent): void {
        this.documents = event.files;

        switch (event.action) {
            case eGeneralActions.ADD:
                this.fuelStopForm
                    .get(EFileFormControls.FILES)
                    .patchValue(JSON.stringify(event.files));

                break;
            case eGeneralActions.DELETE:
                this.fuelStopForm
                    .get(EFileFormControls.FILES)
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );

                if (event.deleteId) this.filesForDelete.push(event.deleteId);

                this.fileModified = true;

                break;
            default:
                break;
        }
    }

    private trackFuelStopAddress(address: AddressEntity): void {
        this.fuelService
            .checkFuelStopAddress(
                address?.city,
                address?.state,
                address?.county,
                address?.address,
                address?.street,
                address?.streetNumber,
                address?.country,
                address?.zipCode,
                address?.stateShortName,
                address?.addressUnit
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (isTrue: boolean) => {
                    if (isTrue) {
                        this.fuelStopForm
                            .get('address')
                            .setErrors({ fuelStoreCommonMessage: isTrue });
                    } else {
                        this.fuelStopForm.get('address').setErrors(null);
                    }
                },
            });
    }

    private trackFuelStopPhone(): void {
        this.fuelStopForm
            .get('phone')
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                switchMap((value: string) => {
                    if (value.length === 14)
                        return this.fuelService.checkFuelStopPhone(value);

                    return of(false);
                })
            )
            .subscribe((isTrue: boolean) => {
                if (isTrue) {
                    this.fuelStopForm
                        .get('phone')
                        .setErrors({ fuelStoreCommonMessage: isTrue });
                } else {
                    this.fuelStopForm.get('phone').setErrors(null);
                }
            });
    }

    private trackFuelStopFranchise(): void {
        this.fuelStopForm
            .get('store')
            .valueChanges.pipe(
                takeUntil(this.destroy$),
                switchMap((value: string) => {
                    if (value) {
                        return this.fuelService.checkFuelStopFranchise(
                            this.selectedFuelStop.id,
                            value
                        );
                    }

                    return of(false);
                })
            )
            .subscribe((isTrue: boolean) => {
                if (isTrue) {
                    this.fuelStopForm
                        .get('store')
                        .setErrors({ fuelStore: isTrue });
                } else {
                    this.fuelStopForm.get('store').setErrors(null);
                }
            });
    }

    private updateFuelStop(id: number): void {
        const { businessName, ...form } = this.fuelStopForm.value;

        let documents = [];

        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const newData: any = {
            id: id,
            ...form,
            address: this.selectedAddress,
            businessName: !this.selectedFuelStop ? businessName : null,
            fuelStopFranchiseId: this.selectedFuelStop
                ? this.selectedFuelStop.id
                : null,
            files: documents ? documents : this.fuelStopForm.value.files,
            filesForDeleteIds: this.filesForDelete,
            longitude: this.longitude,
            latitude: this.latitude,
        };

        this.fuelService
            .updateFuelStop(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private addFuelStop(): void {
        const { businessName, ...form } = this.fuelStopForm.value;

        let documents = [];

        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const newData: any = {
            ...form,
            address: this.selectedAddress,
            businessName: !this.selectedFuelStop ? businessName : null,
            fuelStopFranchiseId: this.selectedFuelStop
                ? this.selectedFuelStop.id
                : null,
            files: documents,
            longitude: this.longitude,
            latitude: this.latitude,
        };

        this.fuelService
            .addFuelStop(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private getFuelStopById(id: number): void {
        this.fuelService
            .getFuelStopById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.fuelStopForm.patchValue({
                        businessName: res.businessName,
                        fuelStopFranchiseId: res.fuelStopFranchise
                            ? res.fuelStopFranchise.businessName
                            : null,
                        favourite: res.favourite,
                        fax: res.fax,
                        address: res.address.address,
                        note: res.note,
                    });

                    this.isFavouriteFuelStop = res.favourite;

                    this.fuelStopForm
                        .get('phone')
                        .patchValue(res.phone, { emitEvent: false });
                    this.fuelStopForm
                        .get('store')
                        .patchValue(res.store, { emitEvent: false });

                    this.companyId = res.companyId;

                    this.selectedFuelStop = res.fuelStopFranchise;
                    this.selectedAddress = res.address;

                    this.fuelStopName = res.fuelStopFranchise
                        ? res.fuelStopFranchise.businessName
                        : res.businessName;

                    this.documents = res.files;

                    if (!res.fuelStopFranchise) {
                        this.fuelStopForm
                            .get('fuelStopFranchiseId')
                            .clearValidators();
                        this.fuelStopForm
                            .get('fuelStopFranchiseId')
                            .updateValueAndValidity();
                        this.fuelStopForm
                            .get('businessName')
                            .setValidators(Validators.required);
                    }

                    setTimeout(() => {
                        this.startFormChanges();
                        this.isCardAnimationDisabled = false;
                    }, 1000);
                },
            });
    }

    private getModalDropdowns(
        pageIndex: number = 1,
        pageSize: number = 25
    ): void {
        this.fuelService
            .getFuelStopModalDropdowns(pageIndex, pageSize)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: GetFuelStopModalResponse) => {
                    this.fuelStops = [
                        ...this.fuelStops,
                        ...res.pagination.data.map((item) => {
                            return {
                                id: item.id,
                                name: item.businessName,
                                count: item.count,
                            };
                        }),
                    ];

                    this.fuelStops = this.fuelStops.filter(
                        (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
                    );

                    if (this.editData?.type === eGeneralActions.EDIT) {
                        this.isCardAnimationDisabled = true;

                        this.getFuelStopById(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
            });
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.fuelStopForm);

        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
