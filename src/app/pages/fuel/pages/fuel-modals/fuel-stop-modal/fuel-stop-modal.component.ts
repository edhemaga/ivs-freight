import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { of, Subject, switchMap, takeUntil } from 'rxjs';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

//Helpers
import {
    addressValidation,
    businessNameValidation,
    fuelStopValidation,
    fuelStoreValidation,
    phoneFaxRegex,
} from 'src/app/shared/components/ta-input/validators/ta-input.regex-validations';

//Services
import { TaInputService } from 'src/app/shared/components/ta-input/services/ta-input.service';
import { ModalService } from 'src/app/shared/components/ta-modal/services/modal.service';
import { FormService } from '../../../../../core/services/form/form.service';
import { FuelService } from 'src/app/shared/services/fuel.service';

//Models
import { AddressEntity } from 'appcoretruckassist';
import {
    FuelStopResponse,
    GetFuelStopModalResponse,
} from '../../../../../../../appcoretruckassist';

//Components
import { TaModalComponent } from 'src/app/shared/components/ta-modal/ta-modal.component';
import { TaInputComponent } from 'src/app/shared/components/ta-input/ta-input.component';
import { InputAddressDropdownComponent } from '../../../../../core/components/shared/input-address-dropdown/input-address-dropdown.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from 'src/app/shared/components/ta-input-note/ta-input-note.component';
import { TaUploadFilesComponent } from 'src/app/shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputDropdownComponent } from 'src/app/shared/components/ta-input-dropdown/ta-input-dropdown.component';

//Modules
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-fuel-stop-modal',
    templateUrl: './fuel-stop-modal.component.html',
    styleUrls: ['./fuel-stop-modal.component.scss'],
    providers: [ModalService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // Component
        TaModalComponent,
        TaInputComponent,
        InputAddressDropdownComponent,
        TaCustomCardComponent,
        TaInputNoteComponent,
        TaUploadFilesComponent,
        TaInputDropdownComponent,
    ],
})
export class FuelStopModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public fuelStopForm: UntypedFormGroup;

    public fuelStops: any[] = [];
    public selectedFuelStop: any = null;

    public selectedAddress: AddressEntity;

    public isFavouriteFuelStop: boolean = false;

    public fuelStopName: string = null;

    public companyId: number = null;

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    public disableCardAnimation: boolean = false;

    public longitude: number;
    public latitude: number;

    private destroy$ = new Subject<void>();

    public isFormDirty: boolean;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private formService: FormService,
        private fuelService: FuelService
    ) {}

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

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save': {
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
            }
            default: {
                break;
            }
        }
    }

    public favouriteFuelStop() {
        this.isFavouriteFuelStop = !this.isFavouriteFuelStop;
        this.fuelStopForm.get('favourite').patchValue(this.isFavouriteFuelStop);
    }

    public onSelectDropdown(event: any, action) {
        switch (action) {
            case 'fuel-stop': {
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
            }
            default: {
                break;
            }
        }
    }

    public onSaveNewFuelStop(event: any) {
        this.fuelStopForm.get('businessName').patchValue(event.data.name);
        this.fuelStopForm.get('fuelStopFranchiseId').clearValidators();
        this.fuelStopForm.get('fuelStopFranchiseId').patchValue(null);
        this.selectedFuelStop = null;
        this.fuelStopForm
            .get('businessName')
            .setValidators([Validators.required, ...businessNameValidation]);
    }

    public clearNewFuelStop() {
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

        if (this.selectedAddress) {
            this.trackFuelStopAddress(this.selectedAddress);
        }
    }

    public paginationPage(pageIndex: number) {
        this.getModalDropdowns(pageIndex, 25);
    }

    public onFilesEvent(event: any) {
        this.documents = event.files;
        switch (event.action) {
            case 'add': {
                this.fuelStopForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.fuelStopForm
                    .get('files')
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );
                if (event.deleteId) {
                    this.filesForDelete.push(event.deleteId);
                }

                this.fileModified = true;
                break;
            }
            default: {
                break;
            }
        }
    }

    private trackFuelStopAddress(address: AddressEntity) {
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
                error: () => {},
            });
    }

    private trackFuelStopPhone() {
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

    private trackFuelStopFranchise() {
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

    private updateFuelStop(id: number) {
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

    private addFuelStop() {
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

    private getFuelStopById(id: number) {
        this.fuelService
            .getFuelStopById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: FuelStopResponse) => {
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
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private getModalDropdowns(pageIndex: number = 1, pageSize: number = 25) {
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

                    if (this.editData?.type === 'edit') {
                        this.disableCardAnimation = true;
                        this.getFuelStopById(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
                error: () => {},
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
