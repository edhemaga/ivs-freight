import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { tab_modal_animation } from '../../../../../core/components/shared/animations/tabs-modal.animation';
import { TaInputService } from '../../../../../core/components/shared/ta-input/ta-input.service';
import {
    AddressEntity,
    CheckOwnerSsnEinResponse,
    CreateResponse,
    GetDriverModalResponse,
} from 'appcoretruckassist';
import {
    accountBankValidation,
    addressUnitValidation,
    addressValidation,
    bankValidation,
    einNumberRegex,
    firstNameValidation,
    fuelCardValidation,
    lastNameValidation,
    name2_24Validation,
    nicknameValidation,
    perStopValidation,
    phoneFaxRegex,
    routingBankValidation,
    ssnNumberRegex,
} from '../../../../../core/components/shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../../../../core/components/shared/ta-modal/modal.service';
import { TaUploadFileService } from '../../../../../core/components/shared/ta-upload-files/ta-upload-file.service';
import { DriverTService } from 'src/app/pages/driver/services/driver.service';
import { HttpResponseBase } from '@angular/common/http';

import { DropZoneConfig } from '../../../../../core/components/shared/ta-upload-files/ta-upload-dropzone/ta-upload-dropzone.component';
import { BankVerificationService } from '../../../../../core/services/BANK-VERIFICATION/bankVerification.service';
import { FormService } from '../../../../../core/services/form/form.service';
import {
    convertDateFromBackend,
    convertDateToBackend,
    convertNumberInThousandSep,
    convertThousanSepInNumber,
} from '../../../../../core/utils/methods.calculations';
import { EditTagsService } from 'src/app/core/services/shared/editTags.service';
import { CommonModule } from '@angular/common';
import { TaModalComponent } from '../../../../../core/components/shared/ta-modal/ta-modal.component';
import { AppTooltipComponent } from '../../../../../core/components/standalone-components/app-tooltip/app-tooltip.component';
import { TaTabSwitchComponent } from '../../../../../core/components/standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '../../../../../core/components/shared/ta-input/ta-input.component';
import { InputAddressDropdownComponent } from '../../../../../core/components/shared/input-address-dropdown/input-address-dropdown.component';
import { TaCustomCardComponent } from '../../../../../core/components/shared/ta-custom-card/ta-custom-card.component';
import { TaCheckboxComponent } from '../../../../../core/components/shared/ta-checkbox/ta-checkbox.component';
import { TaNgxSliderComponent } from '../../../../../core/components/shared/ta-ngx-slider/ta-ngx-slider.component';
import { TaUploadFilesComponent } from '../../../../../core/components/shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '../../../../../core/components/shared/ta-input-note/ta-input-note.component';
import { TaCheckboxCardComponent } from '../../../../../core/components/shared/ta-checkbox-card/ta-checkbox-card.component';
import { TaInputDropdownComponent } from '../../../../../core/components/shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaLogoChangeComponent } from '../../../../../core/components/shared/ta-logo-change/ta-logo-change.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';
import { ConfirmationModalComponent } from '../../../../../core/components/modals/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-driver-modal',
    templateUrl: './driver-modal.component.html',
    styleUrls: ['./driver-modal.component.scss'],
    animations: [tab_modal_animation('animationTabsModal')],
    providers: [ModalService, FormService, BankVerificationService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbModule,

        // Component
        AppTooltipComponent,
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        InputAddressDropdownComponent,
        TaCustomCardComponent,
        TaCheckboxComponent,
        TaNgxSliderComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaCheckboxCardComponent,
        TaInputDropdownComponent,
        TaLogoChangeComponent,
    ],
})
export class DriverModalComponent implements OnInit, OnDestroy {
    @ViewChild(TaTabSwitchComponent) tabSwitch: TaTabSwitchComponent;

    @Input() editData: any;

    // Logo Actions
    public croppieOptions: Croppie.CroppieOptions = {
        enableExif: true,
        viewport: {
            width: 616,
            height: 194,
            type: 'square',
        },
        boundary: {
            width: 616,
            height: 194,
        },
        enforceBoundary: false,
    };

    public displayDeleteAction: boolean = false;
    public displayUploadZone: boolean = false;

    public driverForm: UntypedFormGroup;

    public labelsBank: any[] = [];
    public labelsPayType: any[] = [];

    public isOwner: boolean = false;
    public isBankSelected: boolean = false;

    public selectedOwnerTab: any = null;
    public selectedAddress: AddressEntity = null;
    public selectedOffDutyAddressArray: AddressEntity[] = [];
    public selectedBank: any = null;
    public selectedPayType: any = null;

    public driverFullName: string = null;

    public owner: CheckOwnerSsnEinResponse = null;

    public disablePayType: boolean = false;
    public driverStatus: boolean = true;

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];
    public tags: any[] = [];

    // Delete when back coming
    public hasMilesSameRate: boolean = false;
    public fleetType: string = 'Solo';
    public payrollCompany: any;
    public loadingOwnerEin: boolean = false;
    public disableCardAnimation: boolean = false;

    public selectedTab: number = 1;
    public tabs: any[] = [
        {
            id: 1,
            name: 'Basic',
            checked: true,
        },
        {
            id: 2,
            name: 'Additional',
        },
    ];
    public ownerTabs: any[] = [
        {
            id: 'sole',
            name: 'Sole Proprietor',
            checked: true,
        },
        {
            id: 'company',
            name: 'Company',
            checked: false,
        },
    ];
    public soloSliderOptions: Options = {
        floor: 10,
        ceil: 50,
        step: 1,
        showSelectionBar: true,
        hideLimitLabels: true,
    };

    public teamSliderOptions: Options = {
        floor: 10,
        ceil: 50,
        step: 1,
        showSelectionBar: true,
        hideLimitLabels: true,
    };

    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };

    public dropZoneConfig: DropZoneConfig = {
        dropZoneType: 'files',
        dropZoneSvg: 'assets/svg/common/ic_files_dropzone.svg',
        dropZoneAvailableFiles:
            'application/pdf, image/png, image/jpeg, image/jpg',
        multiple: true,
        globalDropZone: true,
    };

    public longitude: number;
    public latitude: number;

    public isFormDirty: boolean;

    public addNewAfterSave: boolean = false;

    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private driverTService: DriverTService,
        private modalService: ModalService,
        private uploadFileService: TaUploadFileService,
        private bankVerificationService: BankVerificationService,
        private formService: FormService,
        private tagsService: EditTagsService,
        private ngbActiveModal: NgbActiveModal
    ) {}

    public get offDutyLocations(): UntypedFormArray {
        return this.driverForm.get('offDutyLocations') as UntypedFormArray;
    }

    ngOnInit(): void {
        this.createForm();
        this.getDriverDropdowns();
        this.onIncludePayroll();
        this.onTwicTypeSelected();

        this.isCheckedOwner();
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        if (data.action === 'close') {
            return;
        }

        if (
            data.action === ConstantStringTableComponentsEnum.DEACTIVATE &&
            this.editData
        ) {
            const mappedEvent = {
                ...this.editData,
                data: {
                    ...this.editData.data,
                    name: this.editData.data?.fullName,
                },
            };
            this.ngbActiveModal.close();
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...mappedEvent,
                    template: ConstantStringTableComponentsEnum.DRIVER,
                    type: data.bool
                        ? ConstantStringTableComponentsEnum.DEACTIVATE
                        : ConstantStringTableComponentsEnum.ACTIVATE,
                    image: true,
                }
            );
        }
        // Save And Add New
        else if (data.action === 'save and add new') {
            if (this.driverForm.invalid || !this.isFormDirty) {
                this.inputService.markInvalid(this.driverForm);
                return;
            }
            this.addDriver();
            this.modalService.setModalSpinner({
                action: 'save and add new',
                status: true,
                close: false,
            });
            this.addNewAfterSave = true;
        }
        // Save or Update and Close
        else if (data.action === 'save') {
            if (this.driverForm.invalid || !this.isFormDirty) {
                this.inputService.markInvalid(this.driverForm);
                return;
            }
            // Update
            if (this.editData?.id) {
                this.updateDriver(this.editData.id);
                this.modalService.setModalSpinner({
                    action: null,
                    status: true,
                    close: false,
                });
            }
            // Save
            else {
                this.addDriver();
                this.modalService.setModalSpinner({
                    action: null,
                    status: true,
                    close: false,
                });
            }
        }
        // Delete
        else if (
            data.action === ConstantStringTableComponentsEnum.DELETE &&
            this.editData?.id
        ) {
            const mappedEvent = {
                ...this.editData,
                data: {
                    ...this.editData.data,
                    name: this.editData.data?.fullName,
                },
            };
            this.ngbActiveModal.close();
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...mappedEvent,
                    template: ConstantStringTableComponentsEnum.DRIVER,
                    type: ConstantStringTableComponentsEnum.DELETE,
                    image: true,
                }
            );
        }
    }

    public addOffDutyLocation(event: { check: boolean; action: string }) {
        if (event.check) {
            this.offDutyLocations.push(this.createOffDutyLocation());
        }
    }

    public removeOffDutyLocation(id: number) {
        this.offDutyLocations.removeAt(id);
        this.selectedOffDutyAddressArray.slice(id, 1);
    }

    public onSaveNewBank(bank: { data: any; action: string }) {
        this.selectedBank = bank.data;

        this.bankVerificationService
            .createBank({ name: bank.data.name })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CreateResponse) => {
                    this.selectedBank = {
                        id: res.id,
                        name: bank.data.name,
                    };
                    this.labelsBank = [...this.labelsBank, this.selectedBank];
                },
                error: () => {},
            });
    }

    public onHandleAddress(event: {
        address: AddressEntity;
        valid: boolean;
        longLat: any;
    }): void {
        if (event.valid) {
            this.selectedAddress = event.address;
            this.longitude = event.longLat.longitude;
            this.latitude = event.longLat.latitude;
        }
    }

    public handlingPayrollFleetType(
        fleetType: string,
        dropdownsInit: boolean = false
    ) {
        if (fleetType === 'Combined') {
            if (dropdownsInit) {
                this.driverForm.get('teamDriver').patchValue(true);
                this.driverForm.get('soloDriver').patchValue(true);
            }

            this.driverForm
                .get('soloDriver')
                .valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe((val) => {
                    if (!val && !this.driverForm.get('isOwner').value) {
                        this.driverForm.get('teamDriver').patchValue(true);
                        this.inputService.changeValidators(
                            this.driverForm.get('soloEmptyMile'),
                            false,
                            [],
                            false
                        );
                        this.inputService.changeValidators(
                            this.driverForm.get('soloLoadedMile'),
                            false,
                            [],
                            false
                        );
                    }
                });

            this.driverForm
                .get('teamDriver')
                .valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe((val) => {
                    if (!val && !this.driverForm.get('isOwner').value) {
                        this.driverForm.get('soloDriver').patchValue(true);
                        this.inputService.changeValidators(
                            this.driverForm.get('teamEmptyMile'),
                            false,
                            [],
                            false
                        );
                        this.inputService.changeValidators(
                            this.driverForm.get('teamLoadedMile'),
                            false,
                            [],
                            false
                        );
                    }
                });
        }
    }

    public onHandleAddressFormArray(
        event: { address: AddressEntity | any; valid: boolean },
        index: number
    ) {
        this.selectedOffDutyAddressArray[index] = event.address;

        if (!event.valid) {
            this.offDutyLocations.at(index).setErrors({ invalid: true });
        } else {
            this.offDutyLocations.at(index).patchValue({
                address: this.selectedOffDutyAddressArray[index].address,
                city: this.selectedOffDutyAddressArray[index].city,
                state: this.selectedOffDutyAddressArray[index].state,
                stateShortName:
                    this.selectedOffDutyAddressArray[index].stateShortName,
                country: this.selectedOffDutyAddressArray[index].country,
                zipCode: this.selectedOffDutyAddressArray[index].zipCode,
                addressUnit: this.offDutyLocations.at(index).get('addressUnit')
                    .value,
                street: this.selectedOffDutyAddressArray[index].street,
                streetNumber:
                    this.selectedOffDutyAddressArray[index].streetNumber,
            });
        }
    }

    public premmapedOffDutyLocation() {
        return this.offDutyLocations.controls.map((item) => {
            return {
                id: item.get('id').value ? item.get('id').value : 0,
                nickname: item.get('nickname').value,
                address: {
                    address: item.get('address').value,
                    city: item.get('city').value,
                    state: item.get('state').value,
                    stateShortName: item.get('stateShortName').value,
                    country: item.get('country').value,
                    zipCode: item.get('zipCode').value,
                    addressUnit: item.get('addressUnit').value,
                    street: item.get('street').value,
                    streetNumber: item.get('streetNumber').value,
                },
            };
        });
    }

    public tabChange(event: any): void {
        this.selectedTab = event.id;

        this.tabs = this.tabs.map((item) => {
            return {
                ...item,
                checked: item.id === event.id,
            };
        });

        this.uploadFileService.visibilityDropZone(this.selectedTab === 2);

        let dotAnimation = document.querySelector('.animation-two-tabs');

        this.animationObject = {
            value: this.selectedTab,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };

        if (this.selectedTab === 1) {
            this.dropZoneConfig = {
                dropZoneType: 'files',
                dropZoneSvg: 'assets/svg/common/ic_files_dropzone.svg',
                dropZoneAvailableFiles:
                    'application/pdf, image/png, image/jpeg, image/jpg',
                multiple: true,
                globalDropZone: false,
            };
        } else {
            this.dropZoneConfig = {
                dropZoneType: 'image',
                dropZoneAvailableFiles:
                    'image/gif, image/jpeg, image/jpg, image/png',
                dropZoneSvg: 'assets/svg/common/ic_image_dropzone.svg',
                multiple: false,
                globalDropZone: true,
            };
        }
    }

    public tabOwnerChange(event: any): void {
        if (event) {
            this.selectedOwnerTab = event;
            this.driverForm
                .get('ownerType')
                .patchValue(this.selectedOwnerTab.name);
            if (
                this.driverForm.get('isOwner').value &&
                this.selectedOwnerTab?.name.toLowerCase() === 'company'
            ) {
                this.inputService.changeValidators(
                    this.driverForm.get('ein'),
                    true,
                    [einNumberRegex],
                    false
                );
                this.einNumberChange();
            } else {
                this.inputService.changeValidators(
                    this.driverForm.get('ein'),
                    false,
                    [],
                    false
                );
            }
        }

        this.ownerTabs = this.ownerTabs.map((item) => {
            return { ...item, checked: item.id === this.selectedOwnerTab.id };
        });
    }

    public onSelectDropdown(event: any, action: string): void {
        switch (action) {
            case 'bank': {
                this.selectedBank = event;
                if (!event) {
                    this.driverForm.get('bankId').patchValue(null);
                }
                this.onBankSelected();
                break;
            }
            case 'paytype': {
                this.selectedPayType = event;
                // First delete all requred
                this.inputService.changeValidators(
                    this.driverForm.get('perMileSolo'),
                    false,
                    [],
                    false
                );
                this.inputService.changeValidators(
                    this.driverForm.get('soloEmptyMile'),
                    false,
                    [],
                    false
                );
                this.inputService.changeValidators(
                    this.driverForm.get('soloLoadedMile'),
                    false,
                    [],
                    false
                );
                this.inputService.changeValidators(
                    this.driverForm.get('perMileTeam'),
                    false,
                    [],
                    false
                );
                this.inputService.changeValidators(
                    this.driverForm.get('teamEmptyMile'),
                    false,
                    [],
                    false
                );
                this.inputService.changeValidators(
                    this.driverForm.get('teamLoadedMile'),
                    false,
                    [],
                    false
                );
                this.inputService.changeValidators(
                    this.driverForm.get('soloFlatRate'),
                    false,
                    [],
                    false
                );
                this.inputService.changeValidators(
                    this.driverForm.get('teamFlatRate'),
                    false,
                    [],
                    false
                );

                // Per Mile
                if (this.selectedPayType?.id === 1) {
                    if (this.fleetType === 'Solo') {
                        if (this.hasMilesSameRate) {
                            this.inputService.changeValidators(
                                this.driverForm.get('perMileSolo')
                            );
                        } else {
                            this.inputService.changeValidators(
                                this.driverForm.get('soloEmptyMile')
                            );
                            this.inputService.changeValidators(
                                this.driverForm.get('soloLoadedMile')
                            );
                        }
                    } else if (this.fleetType === 'Team') {
                        if (this.hasMilesSameRate) {
                            this.inputService.changeValidators(
                                this.driverForm.get('perMileTeam')
                            );
                        } else {
                            this.inputService.changeValidators(
                                this.driverForm.get('teamEmptyMile')
                            );
                            this.inputService.changeValidators(
                                this.driverForm.get('teamLoadedMile')
                            );
                        }
                    } else if (this.fleetType === 'Combined') {
                        this.inputService.changeValidators(
                            this.driverForm.get('soloEmptyMile')
                        );
                        this.inputService.changeValidators(
                            this.driverForm.get('soloLoadedMile')
                        );
                        this.inputService.changeValidators(
                            this.driverForm.get('teamEmptyMile')
                        );
                        this.inputService.changeValidators(
                            this.driverForm.get('teamLoadedMile')
                        );
                    }
                }
                // Flat Rate
                else if (this.selectedPayType?.id === 3) {
                    if (this.fleetType === 'Solo') {
                        this.inputService.changeValidators(
                            this.driverForm.get('soloFlatRate')
                        );
                    } else if (this.fleetType === 'Team') {
                        this.inputService.changeValidators(
                            this.driverForm.get('teamFlatRate')
                        );
                    } else if (this.fleetType === 'Combined') {
                        this.inputService.changeValidators(
                            this.driverForm.get('soloFlatRate')
                        );
                        this.inputService.changeValidators(
                            this.driverForm.get('teamFlatRate')
                        );
                    }
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    public onUploadImage(event: any) {
        this.driverForm.get('avatar').patchValue(event);
        this.driverForm.get('avatar').setErrors(null);
    }

    public onImageValidation(event: boolean) {
        if (!event) {
            this.driverForm.get('avatar').setErrors({ invalid: true });
        } else {
            this.inputService.changeValidators(
                this.driverForm.get('avatar'),
                false
            );
        }
    }

    public onSaveLogoAction(event: any) {
        if (event) {
            this.displayDeleteAction = true;
        }
    }

    public onFilesEvent(event: any) {
        switch (event.action) {
            case 'add': {
                this.documents = event.files;
                this.driverForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.documents = event.files;
                this.driverForm
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
            case 'tag': {
                let changedTag = false;
                event.files.map((item) => {
                    if (item.tagChanged) {
                        changedTag = true;
                    }
                });

                this.driverForm
                    .get('tags')
                    .patchValue(changedTag ? true : null);
                break;
            }
            default: {
                break;
            }
        }
    }

    public validateMiles() {
        if (['Solo', 'Combined'].includes(this.fleetType)) {
            this.driverForm
                .get('soloEmptyMile')
                .valueChanges.pipe(
                    distinctUntilChanged(),
                    takeUntil(this.destroy$)
                )
                .subscribe((value) => {
                    if (value > 10) {
                        this.driverForm
                            .get('soloEmptyMile')
                            .setErrors({ invalid: true });
                    } else {
                        this.driverForm.get('soloEmptyMile').setErrors(null);
                    }
                });

            this.driverForm
                .get('soloLoadedMile')
                .valueChanges.pipe(
                    distinctUntilChanged(),
                    takeUntil(this.destroy$)
                )
                .subscribe((value) => {
                    if (value > 10) {
                        this.driverForm
                            .get('soloLoadedMile')
                            .setErrors({ invalid: true });
                    } else {
                        this.driverForm.get('soloLoadedMile').setErrors(null);

                        this.driverForm.get('soloEmptyMile').patchValue(value);
                    }
                });
        }

        if (['Team', 'Combined'].includes(this.fleetType)) {
            this.driverForm
                .get('teamEmptyMile')
                .valueChanges.pipe(
                    distinctUntilChanged(),
                    takeUntil(this.destroy$)
                )
                .subscribe((value) => {
                    if (value > 10) {
                        this.driverForm
                            .get('teamEmptyMile')
                            .setErrors({ invalid: true });
                    } else {
                        this.driverForm.get('teamEmptyMile').setErrors(null);
                    }
                });

            this.driverForm
                .get('teamLoadedMile')
                .valueChanges.pipe(
                    distinctUntilChanged(),
                    takeUntil(this.destroy$)
                )
                .subscribe((value) => {
                    if (value > 10) {
                        this.driverForm
                            .get('teamLoadedMile')
                            .setErrors({ invalid: true });
                    } else {
                        this.driverForm.get('teamLoadedMile').setErrors(null);

                        this.driverForm.get('teamEmptyMile').patchValue(value);
                    }
                });
        }
    }

    private createForm(): void {
        this.driverForm = this.formBuilder.group({
            firstName: [null, [Validators.required, ...firstNameValidation]],
            lastName: [null, [Validators.required, ...lastNameValidation]],
            phone: [null, [Validators.required, phoneFaxRegex]],
            email: [null, [Validators.required]],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            dateOfBirth: [null, Validators.required],
            ssn: [null, [Validators.required, ssnNumberRegex]],
            mvrExpiration: [null, Validators.required],
            bankId: [null, [...bankValidation]],
            account: [null, accountBankValidation],
            routing: [null, routingBankValidation],
            payType: [null, [Validators.required]],
            useTruckAssistAch: [false],
            soloDriver: [false],
            teamDriver: [false],
            soloEmptyMile: [null],
            soloLoadedMile: [null],
            soloPerStop: [null, perStopValidation],
            perMileSolo: [null], // if has same rate loaded and empty
            soloFlatRate: [null, perStopValidation],
            teamEmptyMile: [null],
            teamLoadedMile: [null],
            teamPerStop: [null, perStopValidation],
            perMileTeam: [null], // if has same rate loaded and empty
            teamFlatRate: [null, perStopValidation],
            commissionSolo: [25],
            commissionTeam: [25],
            isOwner: [false],
            ownerId: [null],
            ownerType: ['Sole Proprietor'],
            ein: [null, einNumberRegex],
            bussinesName: [null],
            offDutyLocations: this.formBuilder.array([]),
            emergencyContactName: [
                null,
                [Validators.required, ...name2_24Validation],
            ],
            emergencyContactPhone: [null, [phoneFaxRegex, Validators.required]],
            emergencyContactRelationship: [null, name2_24Validation],
            note: [null],
            avatar: [null],
            twic: [false],
            twicExpDate: [null],
            fuelCard: [null, [...fuelCardValidation]],
            mailNotificationGeneral: [true],
            pushNotificationGeneral: [false],
            smsNotificationGeneral: [false],
            mailNotificationPayroll: [true],
            pushNotificationPayroll: [false],
            smsNotificationPayroll: [false],
            files: [null],
            tags: [null],
        });

        this.inputService.customInputValidator(
            this.driverForm.get('email'),
            'email',
            this.destroy$
        );
    }

    private createOffDutyLocation(data?: {
        id: number;
        nickname: string;
        address: string;
        city: string;
        state: string;
        stateShortName: string;
        country: string;
        zipCode: string;
        addressUnit: string;
        street: string;
        streetNumber: string;
    }): UntypedFormGroup {
        return this.formBuilder.group({
            id: [data?.id ? data.id : 0],
            nickname: [
                data?.nickname ? data.nickname : null,
                nicknameValidation,
            ],
            address: [
                data?.address ? data.address : null,
                [...addressValidation],
            ],
            city: [data?.city ? data.city : null],
            state: [data?.state ? data.state : null],
            stateShortName: [data?.stateShortName ? data.stateShortName : null],
            country: [data?.country ? data.country : null],
            zipCode: [data?.zipCode ? data.zipCode : null],
            addressUnit: [
                data?.addressUnit ? data.addressUnit : null,
                [...addressUnitValidation],
            ],
            street: [data?.street ? data.street : null],
            streetNumber: [data?.streetNumber ? data.streetNumber : null],
        });
    }

    private onIncludePayroll(): void {
        this.driverForm
            .get('useTruckAssistAch')
            .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.inputService.changeValidators(
                        this.driverForm.get('bankId')
                    );
                } else {
                    this.inputService.changeValidators(
                        this.driverForm.get('bankId'),
                        false,
                        [],
                        false
                    );
                }
            });
    }

    private onBankSelected() {
        this.driverForm
            .get('bankId')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                const timeout = setTimeout(async () => {
                    this.isBankSelected =
                        await this.bankVerificationService.onSelectBank(
                            this.selectedBank ? this.selectedBank.name : null,
                            this.driverForm.get('routing'),
                            this.driverForm.get('account')
                        );
                    clearTimeout(timeout);
                }, 100);
            });
    }

    private onTwicTypeSelected(): void {
        this.driverForm
            .get('twic')
            .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.inputService.changeValidators(
                        this.driverForm.get('twicExpDate')
                    );
                } else {
                    this.inputService.changeValidators(
                        this.driverForm.get('twicExpDate'),
                        false
                    );
                }
            });
    }

    private isCheckedOwner() {
        this.driverForm
            .get('isOwner')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value && !this.driverForm.get('ownerType').value) {
                    this.driverForm
                        .get('ownerType')
                        .patchValue('Sole Proprietor');
                }

                if (value) {
                    this.disablePayType = true;
                    this.inputService.changeValidators(
                        this.driverForm.get('payType'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.driverForm.get('soloEmptyMile'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.driverForm.get('soloLoadedMile'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.driverForm.get('soloPerStop'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.driverForm.get('soloPerMile'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.driverForm.get('teamEmptyMile'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.driverForm.get('teamLoadedMile'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.driverForm.get('teamPerStop'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.driverForm.get('teamPerMile'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.driverForm.get('commissionSolo'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.driverForm.get('commissionTeam'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.driverForm.get('bankId'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.driverForm.get('routing'),
                        false
                    );
                    this.inputService.changeValidators(
                        this.driverForm.get('account'),
                        false
                    );
                    this.driverForm.get('soloDriver').patchValue(false);
                    this.driverForm.get('teamDriver').patchValue(false);
                    this.driverForm.get('useTruckAssistAch').patchValue(false);
                    this.isBankSelected = false;
                    this.selectedBank = null;
                    this.selectedPayType = null;
                } else {
                    this.disablePayType = false;
                    this.inputService.changeValidators(
                        this.driverForm.get('payType')
                    );
                }
            });
    }

    private einNumberChange() {
        this.driverForm
            .get('ein')
            .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value?.length === 10) {
                    this.loadingOwnerEin = true;
                    this.driverTService
                        .checkOwnerEinNumber(value.toString())
                        .pipe(takeUntil(this.destroy$))
                        .subscribe({
                            next: (res: CheckOwnerSsnEinResponse) => {
                                this.owner = res?.name ? res : null;
                                this.loadingOwnerEin = false;
                                if (this.owner?.name) {
                                    this.driverForm
                                        .get('bussinesName')
                                        .patchValue(this.owner.name);
                                }
                            },
                            error: () => {},
                        });
                } else {
                    this.driverForm.get('bussinesName').patchValue(null);
                }
            });
    }

    private getDriverDropdowns(): void {
        this.driverTService
            .getDriverDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: GetDriverModalResponse) => {
                    this.labelsBank = data.banks;
                    this.labelsPayType = data.payTypes;
                    this.driverForm
                        .get('mvrExpiration')
                        .patchValue(data.mvrExpiration);
                    this.fleetType = data.fleetType;
                    this.hasMilesSameRate = data.loadedAndEmptySameRate;
                    this.tags = data.tags;

                    if (['Solo', 'Combined'].includes(this.fleetType)) {
                        this.driverForm
                            .get('soloEmptyMile')
                            .patchValue(
                                data.solo?.emptyMile
                                    ? data.solo.emptyMile
                                    : null
                            );

                        this.driverForm
                            .get('soloLoadedMile')
                            .patchValue(
                                data.solo?.loadedMile
                                    ? data.solo.loadedMile
                                    : null
                            );

                        this.driverForm
                            .get('soloPerStop')
                            .patchValue(
                                data.solo?.perStop
                                    ? convertNumberInThousandSep(
                                          data.solo?.perStop
                                              ? data.solo.perStop
                                              : null
                                      )
                                    : null
                            );

                        this.driverForm
                            .get('soloFlatRate')
                            .patchValue(
                                data.soloFlatRate
                                    ? convertNumberInThousandSep(
                                          data.soloFlatRate
                                      )
                                    : null
                            );

                        this.driverForm
                            .get('perMileSolo')
                            .patchValue(data.perMileSolo);

                        if (data.defaultSoloDriverCommission) {
                            this.driverForm
                                .get('commissionSolo')
                                .patchValue(data.defaultSoloDriverCommission);
                        }
                    }

                    if (['Team', 'Combined'].includes(this.fleetType)) {
                        this.driverForm
                            .get('teamEmptyMile')
                            .patchValue(
                                data.team?.emptyMile
                                    ? data.team.emptyMile
                                    : null,
                                {
                                    emitEvent: false,
                                }
                            );

                        this.driverForm
                            .get('teamLoadedMile')
                            .patchValue(
                                data.team?.loadedMile
                                    ? data.team.loadedMile
                                    : null,
                                {
                                    emitEvent: false,
                                }
                            );

                        this.driverForm
                            .get('teamPerStop')
                            .patchValue(
                                data.team?.perStop
                                    ? convertNumberInThousandSep(
                                          data.team?.perStop
                                              ? data.team.perStop
                                              : null
                                      )
                                    : null,
                                {
                                    emitEvent: false,
                                }
                            );

                        this.driverForm
                            .get('teamFlatRate')
                            .patchValue(
                                data.teamFlatRate
                                    ? convertNumberInThousandSep(
                                          data.teamFlatRate
                                      )
                                    : null,
                                {
                                    emitEvent: false,
                                }
                            );

                        this.driverForm
                            .get('perMileTeam')
                            .patchValue(data.perMileTeam, { emitEvent: false });

                        if (data.defaultTeamDriverCommission) {
                            this.driverForm
                                .get('commissionTeam')
                                .patchValue(data.defaultTeamDriverCommission, {
                                    emitEvent: false,
                                });
                        }
                    }

                    this.payrollCompany = {
                        solo: {
                            emptyMile: data.solo?.emptyMile
                                ? data.solo.emptyMile
                                : null,
                            loadedMile: data.solo?.loadedMile
                                ? data.solo.loadedMile
                                : null,
                            perStop: data.solo?.perStop
                                ? convertNumberInThousandSep(data.solo.perStop)
                                : null,
                            perMileSolo: data.perMileSolo,
                            commissionSolo: data.defaultSoloDriverCommission
                                ? data.defaultSoloDriverCommission
                                : this.driverForm.get('commissionSolo').value,
                            soloFlatRate: data.soloFlatRate
                                ? convertNumberInThousandSep(data.soloFlatRate)
                                : null,
                        },
                        team: {
                            emptyMile: data.team?.emptyMile
                                ? data.team.emptyMile
                                : null,
                            loadedMile: data.team?.loadedMile
                                ? data.team.loadedMile
                                : null,
                            perStop: data.team?.perStop
                                ? convertNumberInThousandSep(data.team.perStop)
                                : null,
                            perMileTeam: data.perMileTeam,
                            commissionTeam: data.defaultTeamDriverCommission
                                ? data.defaultTeamDriverCommission
                                : this.driverForm.get('commissionTeam').value,
                            teamFlatRate: data.teamFlatRate
                                ? convertNumberInThousandSep(data.teamFlatRate)
                                : null,
                        },
                        mvrExpiration: data.mvrExpiration
                            ? data.mvrExpiration
                            : 12,
                    };

                    this.handlingPayrollFleetType(this.fleetType, true);

                    if (this.editData) {
                        this.disableCardAnimation = true;
                        this.getDriverById(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
                error: () => {},
            });
    }

    private addDriver(): void {
        const {
            soloEmptyMile,
            soloLoadedMile,
            soloPerStop,
            perMileSolo,
            commissionSolo,

            teamEmptyMile,
            teamLoadedMile,
            teamPerStop,
            perMileTeam,
            commissionTeam,

            soloFlatRate,
            teamFlatRate,

            soloDriver,
            teamDriver,

            mailNotificationGeneral,
            pushNotificationGeneral,
            smsNotificationGeneral,

            mailNotificationPayroll,
            pushNotificationPayroll,
            smsNotificationPayroll,
            mvrExpiration,
            addressUnit,
            ...form
        } = this.driverForm.value;

        let documents = [];
        let tagsArray = [];
        this.documents.map((item) => {
            if (item.tagId?.length)
                tagsArray.push({
                    fileName: item.realFile.name,
                    tagIds: item.tagId,
                });

            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        if (!tagsArray.length) {
            tagsArray = null;
        }

        const newData: any = {
            ...form,
            dateOfBirth: convertDateToBackend(
                this.driverForm.get('dateOfBirth').value
            ),
            mvrExpiration: mvrExpiration,
            ownerId:
                this.driverForm.get('ownerType').value === 'Sole Proprietor'
                    ? null
                    : this.owner
                    ? this.owner.id
                    : null,
            ownerType: !this.driverForm.get('isOwner').value
                ? null
                : this.driverForm.get('ownerType').value === 'Sole Proprietor'
                ? 2
                : 1,
            ein: !this.driverForm.get('isOwner').value
                ? null
                : this.driverForm.get('ownerType').value === 'Sole Proprietor'
                ? null
                : form.ein,
            bussinesName: !this.driverForm.get('isOwner').value
                ? null
                : this.driverForm.get('ownerType').value === 'Sole Proprietor'
                ? null
                : this.driverForm.get('bussinesName').value,
            address: {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            },
            bankId: this.selectedBank ? this.selectedBank.id : null,
            payType: this.selectedPayType ? this.selectedPayType.id : null,
            solo:
                this.selectedPayType?.name === 'Per Mile'
                    ? {
                          emptyMile: !this.hasMilesSameRate
                              ? ['Solo', 'Combined'].includes(this.fleetType)
                                  ? this.fleetType === 'Combined'
                                      ? soloDriver
                                          ? soloEmptyMile
                                              ? parseFloat(soloEmptyMile)
                                              : null
                                          : null
                                      : soloEmptyMile
                                      ? parseFloat(soloEmptyMile)
                                      : null
                                  : null
                              : null,

                          loadedMile: !this.hasMilesSameRate
                              ? ['Solo', 'Combined'].includes(this.fleetType)
                                  ? this.fleetType === 'Combined'
                                      ? soloDriver
                                          ? soloLoadedMile
                                              ? parseFloat(soloLoadedMile)
                                              : null
                                          : null
                                      : soloLoadedMile
                                      ? parseFloat(soloLoadedMile)
                                      : null
                                  : null
                              : null,
                          perStop: !this.hasMilesSameRate
                              ? ['Solo', 'Combined'].includes(this.fleetType)
                                  ? this.fleetType === 'Combined'
                                      ? soloDriver
                                          ? soloPerStop
                                              ? convertThousanSepInNumber(
                                                    soloPerStop
                                                )
                                              : null
                                          : null
                                      : soloPerStop
                                      ? convertThousanSepInNumber(soloPerStop)
                                      : null
                                  : null
                              : null,
                      }
                    : null,
            perMileSolo:
                this.selectedPayType?.name === 'Per Mile'
                    ? this.hasMilesSameRate
                        ? ['Solo', 'Combined'].includes(this.fleetType)
                            ? this.fleetType === 'Combined'
                                ? soloDriver
                                    ? perMileSolo
                                        ? parseFloat(perMileSolo)
                                        : null
                                    : null
                                : perMileSolo
                                ? parseFloat(perMileSolo)
                                : null
                            : null
                        : null
                    : null,
            team:
                this.selectedPayType?.name === 'Per Mile'
                    ? {
                          emptyMile: !this.hasMilesSameRate
                              ? ['Team', 'Combined'].includes(this.fleetType)
                                  ? this.fleetType === 'Combined'
                                      ? teamDriver
                                          ? teamEmptyMile
                                              ? parseFloat(teamEmptyMile)
                                              : null
                                          : null
                                      : teamEmptyMile
                                      ? parseFloat(teamEmptyMile)
                                      : null
                                  : null
                              : null,
                          loadedMile: !this.hasMilesSameRate
                              ? ['Team', 'Combined'].includes(this.fleetType)
                                  ? this.fleetType === 'Combined'
                                      ? teamDriver
                                          ? teamLoadedMile
                                              ? parseFloat(teamLoadedMile)
                                              : null
                                          : null
                                      : teamLoadedMile
                                      ? parseFloat(teamLoadedMile)
                                      : null
                                  : null
                              : null,
                          perStop: !this.hasMilesSameRate
                              ? ['Team', 'Combined'].includes(this.fleetType)
                                  ? this.fleetType === 'Combined'
                                      ? teamDriver
                                          ? teamPerStop
                                              ? convertThousanSepInNumber(
                                                    teamPerStop
                                                )
                                              : null
                                          : null
                                      : teamPerStop
                                      ? convertThousanSepInNumber(teamPerStop)
                                      : null
                                  : null
                              : null,
                      }
                    : null,
            perMileTeam:
                this.selectedPayType?.name === 'Per Mile'
                    ? this.hasMilesSameRate
                        ? ['Team', 'Combined'].includes(this.fleetType)
                            ? this.fleetType === 'Combined'
                                ? teamDriver
                                    ? perMileTeam
                                        ? parseFloat(perMileTeam)
                                        : null
                                    : null
                                : perMileTeam
                                ? parseFloat(perMileTeam)
                                : null
                            : null
                        : null
                    : null,
            commissionSolo:
                this.selectedPayType?.name === 'Commission'
                    ? ['Solo', 'Combined'].includes(this.fleetType)
                        ? this.fleetType === 'Combined'
                            ? soloDriver
                                ? commissionSolo
                                    ? parseFloat(commissionSolo)
                                    : null
                                : null
                            : commissionSolo
                            ? parseFloat(commissionSolo)
                            : null
                        : null
                    : null,
            commissionTeam:
                this.selectedPayType?.name === 'Commission'
                    ? ['Team', 'Combined'].includes(this.fleetType)
                        ? this.fleetType === 'Combined'
                            ? commissionTeam
                                ? commissionTeam
                                    ? parseFloat(commissionTeam)
                                    : null
                                : null
                            : commissionTeam
                            ? parseFloat(commissionTeam)
                            : null
                        : null
                    : null,
            soloFlatRate:
                this.selectedPayType?.name === 'Flat Rate'
                    ? soloFlatRate
                        ? convertThousanSepInNumber(soloFlatRate)
                        : null
                    : null,
            teamFlatRate:
                this.selectedPayType?.name === 'Flat Rate'
                    ? teamFlatRate
                        ? convertThousanSepInNumber(teamFlatRate)
                        : null
                    : null,
            general: {
                mailNotification: mailNotificationGeneral,
                pushNotification: pushNotificationGeneral,
                smsNotification: smsNotificationGeneral,
            },
            payroll: {
                mailNotification: mailNotificationPayroll,
                pushNotification: pushNotificationPayroll,
                smsNotification: smsNotificationPayroll,
            },
            twicExpDate: this.driverForm.get('twic').value
                ? convertDateToBackend(this.driverForm.get('twicExpDate').value)
                : null,
            offDutyLocations: this.premmapedOffDutyLocation(),
            fleetType: this.fleetType,
            soloDriver: !this.driverForm.get('isOwner').value
                ? this.fleetType === 'Combined'
                    ? soloDriver
                    : false
                : null,
            teamDriver: !this.driverForm.get('isOwner').value
                ? this.fleetType === 'Combined'
                    ? teamDriver
                    : false
                : null,
            files: documents,
            longitude: this.longitude,
            latitude: this.latitude,
            tags: tagsArray,
        };

        this.driverTService
            .addDriver(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    // If clicked Save and Add New, reset form and fields
                    if (this.addNewAfterSave) {
                        this.formService.resetForm(this.driverForm);
                        this.modalService.setModalSpinner({
                            action: 'save and add new',
                            status: false,
                            close: false,
                        });
                        this.driverForm.get('ownerType').patchValue(null);
                        this.driverForm.get('payType').patchValue(null);

                        this.tabChange({ id: 1 });

                        this.driverForm
                            .get('soloEmptyMile')
                            .patchValue(this.payrollCompany.solo.emptyMile);
                        this.driverForm
                            .get('soloLoadedMile')
                            .patchValue(this.payrollCompany.solo.loadedMile);
                        this.driverForm
                            .get('soloPerStop')
                            .patchValue(this.payrollCompany.solo.perStop);
                        this.driverForm
                            .get('perMileSolo')
                            .patchValue(this.payrollCompany.solo.perMileSolo);
                        this.driverForm
                            .get('commissionSolo')
                            .patchValue(
                                this.payrollCompany.solo.commissionSolo
                            );

                        this.driverForm
                            .get('soloFlatRate')
                            .patchValue(this.payrollCompany.solo.soloFlatRate);

                        this.driverForm
                            .get('teamEmptyMile')
                            .patchValue(this.payrollCompany.team.emptyMile);
                        this.driverForm
                            .get('teamLoadedMile')
                            .patchValue(this.payrollCompany.team.loadedMile);
                        this.driverForm
                            .get('teamPerStop')
                            .patchValue(this.payrollCompany.team.perStop);
                        this.driverForm
                            .get('perMileTeam')
                            .patchValue(this.payrollCompany.team.perMileTeam);
                        this.driverForm
                            .get('commissionTeam')
                            .patchValue(
                                this.payrollCompany.team.commissionTeam
                            );

                        this.driverForm
                            .get('teamFlatRate')
                            .patchValue(this.payrollCompany.team.teamFlatRate);

                        this.driverForm
                            .get('mvrExpiration')
                            .patchValue(this.payrollCompany.mvrExpiration);

                        this.driverForm
                            .get('mailNotificationGeneral')
                            .patchValue(true);
                        this.driverForm
                            .get('mailNotificationPayroll')
                            .patchValue(true);
                        this.driverForm
                            .get('smsNotificationGeneral')
                            .patchValue(false);
                        this.driverForm
                            .get('smsNotificationPayroll')
                            .patchValue(false);
                        this.driverForm
                            .get('pushNotificationGeneral')
                            .patchValue(false);
                        this.driverForm
                            .get('pushNotificationPayroll')
                            .patchValue(false);

                        this.driverForm
                            .get('useTruckAssistAch')
                            .patchValue(false);

                        this.driverForm.get('twic').patchValue(false);

                        this.driverForm.get('isOwner').patchValue(false);

                        if (this.fleetType === 'Combined') {
                            this.driverForm.get('teamDriver').patchValue(true);
                            this.driverForm.get('soloDriver').patchValue(true);
                        }

                        this.documents = [];
                        this.fileModified = false;
                        this.filesForDelete = [];
                        this.tags = [];

                        this.offDutyLocations.clear();
                        this.addNewAfterSave = false;
                        this.selectedPayType = null;
                        this.selectedBank = null;
                        this.selectedOffDutyAddressArray = [];
                        this.selectedAddress = null;
                    } else {
                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: true,
                        });
                    }
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: this.addNewAfterSave
                            ? 'save and add new'
                            : null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private updateDriver(id: number): void {
        const {
            soloEmptyMile,
            soloLoadedMile,
            soloPerStop,
            perMileSolo,
            commissionSolo,

            teamEmptyMile,
            teamLoadedMile,
            teamPerStop,
            perMileTeam,
            commissionTeam,

            soloFlatRate,
            teamFlatRate,

            mvrExpiration,

            soloDriver,
            teamDriver,

            mailNotificationGeneral,
            pushNotificationGeneral,
            smsNotificationGeneral,

            mailNotificationPayroll,
            pushNotificationPayroll,
            smsNotificationPayroll,

            addressUnit,
            ...form
        } = this.driverForm.value;

        let documents = [];
        let tagsArray = [];
        this.documents.map((item) => {
            if (item.tagId?.length && item?.realFile?.name)
                tagsArray.push({
                    fileName: item.realFile.name,
                    tagIds: item.tagId,
                });

            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        if (!tagsArray.length) {
            tagsArray = null;
        }

        const newData: any = {
            id: id,
            ...form,
            dateOfBirth: convertDateToBackend(
                this.driverForm.get('dateOfBirth').value
            ),
            mvrExpiration: mvrExpiration,
            ownerId:
                this.driverForm.get('ownerType').value === 'Sole Proprietor'
                    ? null
                    : this.owner
                    ? this.owner.id
                    : null,
            ownerType: !this.driverForm.get('isOwner').value
                ? null
                : this.driverForm.get('ownerType').value === 'Sole Proprietor'
                ? 2
                : 1,
            bussinesName:
                this.driverForm.get('ownerType').value === 'Sole Proprietor'
                    ? null
                    : this.driverForm.get('bussinesName').value,
            address: {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            },
            bankId: this.selectedBank ? this.selectedBank.id : null,
            payType: this.selectedPayType ? this.selectedPayType.id : null,
            solo: {
                emptyMile:
                    this.selectedPayType?.name === 'Per Mile'
                        ? !this.hasMilesSameRate
                            ? ['Solo', 'Combined'].includes(this.fleetType)
                                ? this.fleetType === 'Combined'
                                    ? soloDriver
                                        ? soloEmptyMile
                                            ? parseFloat(soloEmptyMile)
                                            : null
                                        : null
                                    : soloEmptyMile
                                    ? parseFloat(soloEmptyMile)
                                    : null
                                : null
                            : null
                        : null,
                loadedMile:
                    this.selectedPayType?.name === 'Per Mile'
                        ? !this.hasMilesSameRate
                            ? ['Solo', 'Combined'].includes(this.fleetType)
                                ? this.fleetType === 'Combined'
                                    ? soloDriver
                                        ? soloLoadedMile
                                            ? parseFloat(soloLoadedMile)
                                            : null
                                        : null
                                    : soloLoadedMile
                                    ? parseFloat(soloLoadedMile)
                                    : null
                                : null
                            : null
                        : null,
                perStop:
                    this.selectedPayType?.name === 'Per Mile'
                        ? !this.hasMilesSameRate
                            ? ['Solo', 'Combined'].includes(this.fleetType)
                                ? this.fleetType === 'Combined'
                                    ? soloDriver
                                        ? soloPerStop
                                            ? convertThousanSepInNumber(
                                                  soloPerStop
                                              )
                                            : null
                                        : null
                                    : soloPerStop
                                    ? convertThousanSepInNumber(soloPerStop)
                                    : null
                                : null
                            : null
                        : null,
            },
            perMileSolo:
                this.selectedPayType?.name === 'Per Mile'
                    ? this.hasMilesSameRate
                        ? ['Solo', 'Combined'].includes(this.fleetType)
                            ? this.fleetType === 'Combined'
                                ? soloDriver
                                    ? perMileSolo
                                        ? parseFloat(perMileSolo)
                                        : null
                                    : null
                                : perMileSolo
                                ? parseFloat(perMileSolo)
                                : null
                            : null
                        : null
                    : null,
            team: {
                emptyMile:
                    this.selectedPayType?.name === 'Per Mile'
                        ? !this.hasMilesSameRate
                            ? ['Team', 'Combined'].includes(this.fleetType)
                                ? this.fleetType === 'Combined'
                                    ? teamDriver
                                        ? teamEmptyMile
                                            ? parseFloat(teamEmptyMile)
                                            : null
                                        : null
                                    : teamEmptyMile
                                    ? parseFloat(teamEmptyMile)
                                    : null
                                : null
                            : null
                        : null,
                loadedMile:
                    this.selectedPayType?.name === 'Per Mile'
                        ? !this.hasMilesSameRate
                            ? ['Team', 'Combined'].includes(this.fleetType)
                                ? this.fleetType === 'Combined'
                                    ? teamDriver
                                        ? teamLoadedMile
                                            ? parseFloat(teamLoadedMile)
                                            : null
                                        : null
                                    : teamLoadedMile
                                    ? parseFloat(teamLoadedMile)
                                    : null
                                : null
                            : null
                        : null,
                perStop:
                    this.selectedPayType?.name === 'Per Mile'
                        ? !this.hasMilesSameRate
                            ? ['Team', 'Combined'].includes(this.fleetType)
                                ? this.fleetType === 'Combined'
                                    ? teamDriver
                                        ? teamPerStop
                                            ? convertThousanSepInNumber(
                                                  teamPerStop
                                              )
                                            : null
                                        : null
                                    : teamPerStop
                                    ? convertThousanSepInNumber(teamPerStop)
                                    : null
                                : null
                            : null
                        : null,
            },
            perMileTeam:
                this.selectedPayType?.name === 'Per Mile'
                    ? this.hasMilesSameRate
                        ? ['Team', 'Combined'].includes(this.fleetType)
                            ? this.fleetType === 'Combined'
                                ? teamDriver
                                    ? perMileTeam
                                        ? parseFloat(perMileTeam)
                                        : null
                                    : null
                                : perMileTeam
                                ? parseFloat(perMileTeam)
                                : null
                            : null
                        : null
                    : null,
            commissionSolo:
                this.selectedPayType?.name === 'Commission'
                    ? ['Solo', 'Combined'].includes(this.fleetType)
                        ? this.fleetType === 'Combined'
                            ? soloDriver
                                ? commissionSolo
                                    ? parseFloat(commissionSolo)
                                    : null
                                : null
                            : commissionSolo
                            ? parseFloat(commissionSolo)
                            : null
                        : null
                    : null,
            commissionTeam:
                this.selectedPayType?.name === 'Commission'
                    ? ['Team', 'Combined'].includes(this.fleetType)
                        ? this.fleetType === 'Combined'
                            ? commissionTeam
                                ? commissionTeam
                                    ? parseFloat(commissionTeam)
                                    : null
                                : null
                            : commissionTeam
                            ? parseFloat(commissionTeam)
                            : null
                        : null
                    : null,
            soloFlatRate:
                this.selectedPayType?.name === 'Flat Rate'
                    ? soloFlatRate
                        ? convertThousanSepInNumber(soloFlatRate)
                        : null
                    : null,
            teamFlatRate:
                this.selectedPayType?.name === 'Flat Rate'
                    ? teamFlatRate
                        ? convertThousanSepInNumber(teamFlatRate)
                        : null
                    : null,
            general: {
                mailNotification: mailNotificationGeneral,
                pushNotification: pushNotificationGeneral,
                smsNotification: smsNotificationGeneral,
            },
            payroll: {
                mailNotification: mailNotificationPayroll,
                pushNotification: pushNotificationPayroll,
                smsNotification: smsNotificationPayroll,
            },
            twicExpDate: this.driverForm.get('twic').value
                ? convertDateToBackend(this.driverForm.get('twicExpDate').value)
                : null,
            offDutyLocations: this.premmapedOffDutyLocation(),
            fleetType: this.fleetType,
            soloDriver: !this.driverForm.get('isOwner').value
                ? this.fleetType === 'Combined'
                    ? soloDriver
                    : false
                : null,
            teamDriver: !this.driverForm.get('isOwner').value
                ? this.fleetType === 'Combined'
                    ? teamDriver
                    : false
                : null,
            files: documents ? documents : this.driverForm.value.files,
            filesForDeleteIds: this.filesForDelete,
            longitude: this.longitude,
            latitude: this.latitude,
            tags: tagsArray,
        };

        this.driverTService
            .updateDriver(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
                    this.updateTags();
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

    private getDriverById(id: number): void {
        this.driverTService
            .getDriverById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.driverForm.patchValue({
                        firstName: res.firstName,
                        lastName: res.lastName,
                        phone: res.phone,
                        email: res.email,
                        address: res.address ? res.address.address : null,
                        addressUnit: res.address
                            ? res.address.addressUnit
                            : null,
                        dateOfBirth: convertDateFromBackend(res.dateOfBirth),
                        ssn: res.ssn,
                        mvrExpiration: res.mvrExpiration,
                        bankId: res.bank ? res.bank.name : null,
                        account: res.account,
                        routing: res.routing,
                        payType: res.payType ? res.payType.name : null,
                        soloPerStop: res.solo.perStop
                            ? convertNumberInThousandSep(res.solo.perStop)
                            : null,
                        soloDriver: res.soloDriver,
                        teamPerStop: res.team.perStop
                            ? convertNumberInThousandSep(res.team.perStop)
                            : null,
                        teamDriver: res.teamDriver,
                        commissionSolo: res.commissionSolo,
                        commissionTeam: res.commissionTeam,
                        ownerId: res.owner ? res.owner.id : null,
                        useTruckAssistAch: res.useTruckAssistAch,
                        isOwner: !!res.owner,
                        ownerType: res.owner
                            ? res.owner?.ownerType?.name
                                ? res.owner?.ownerType?.name.includes(
                                      'Proprietor'
                                  )
                                    ? 'Sole'.concat(
                                          ' ',
                                          res.owner?.ownerType?.name
                                      )
                                    : res.owner?.ownerType?.name
                                : null
                            : null,
                        ein: res.owner
                            ? res.owner?.ownerType?.name.includes('Proprietor')
                                ? null
                                : res.owner?.ssnEin
                            : null,
                        bussinesName: res.owner
                            ? res.owner?.ownerType?.name.includes('Proprietor')
                                ? null
                                : res.owner?.name
                            : null,
                        emergencyContactName: res.emergencyContactName,
                        emergencyContactPhone: res.emergencyContactPhone,
                        emergencyContactRelationship:
                            res.emergencyContactRelationship,

                        note: res.note,
                        avatar: res.avatar ? res.avatar : null,

                        twic: res.twic,
                        twicExpDate: res.twicExpDate
                            ? convertDateFromBackend(res.twicExpDate)
                            : null,
                        fuelCard: res.fuelCard,

                        mailNotificationGeneral: res.general.mailNotification,
                        pushNotificationGeneral: res.general.pushNotification,
                        smsNotificationGeneral: res.general.smsNotification,

                        mailNotificationPayroll: res.payroll.mailNotification,
                        pushNotificationPayroll: res.payroll.pushNotification,
                        smsNotificationPayroll: res.payroll.smsNotification,
                        files: res.files?.length
                            ? JSON.stringify(res.files)
                            : null,
                    });

                    this.driverForm
                        .get('soloLoadedMile')
                        .patchValue(
                            res.solo?.loadedMile ? res.solo.loadedMile : null,
                            {
                                emitEvent: false,
                            }
                        );

                    this.driverForm
                        .get('teamLoadedMile')
                        .patchValue(
                            res.team?.loadedMile ? res.team.loadedMile : null,
                            {
                                emitEvent: false,
                            }
                        );

                    this.driverForm
                        .get('soloEmptyMile')
                        .patchValue(
                            res.solo?.emptyMile ? res.solo.emptyMile : null,
                            {
                                emitEvent: false,
                            }
                        );

                    this.driverForm
                        .get('teamEmptyMile')
                        .patchValue(
                            res.team?.emptyMile ? res.team.emptyMile : null,
                            {
                                emitEvent: false,
                            }
                        );

                    this.driverForm
                        .get('soloFlatRate')
                        .patchValue(
                            ['Solo', 'Combined'].includes(res.fleetType.name)
                                ? res.soloFlatRate
                                    ? convertNumberInThousandSep(
                                          res.soloFlatRate
                                      )
                                    : null
                                : null,
                            { emitEvent: false }
                        );

                    this.driverForm
                        .get('teamFlatRate')
                        .patchValue(
                            ['Team', 'Combined'].includes(res.fleetType.name)
                                ? res.teamFlatRate
                                    ? convertNumberInThousandSep(
                                          res.teamFlatRate
                                      )
                                    : null
                                : null,
                            { emitEvent: false }
                        );

                    this.driverForm
                        .get('perMileSolo')
                        .patchValue(res.perMileSolo, {
                            emitEvent: false,
                        });

                    this.driverForm
                        .get('perMileTeam')
                        .patchValue(res.perMileSolo, {
                            emitEvent: false,
                        });

                    res.firstName =
                        res.firstName.charAt(0).toUpperCase() +
                        res.firstName.slice(1);

                    res.lastName =
                        res.lastName.charAt(0).toUpperCase() +
                        res.lastName.slice(1);

                    this.driverFullName = res.firstName.concat(
                        ' ',
                        res.lastName
                    );

                    this.selectedBank = res.bank ? res.bank : null;

                    this.isBankSelected = !!this.selectedBank;

                    this.documents = res.files;

                    this.selectedPayType = res.payType
                        ? res.payType.id === 0
                            ? null
                            : res.payType
                        : null;

                    this.onHandleAddress({
                        address: res.address,
                        valid: !!res.address,
                        longLat: {
                            longitude: res.longitude,
                            latitude: res.latitude,
                        },
                    });

                    this.modalService.changeModalStatus({
                        name: 'deactivate',
                        status: res.status !== 1,
                    });

                    this.driverStatus = res.status !== 1;

                    this.fleetType = res.fleetType.name;

                    this.handlingPayrollFleetType(this.fleetType);

                    if (res.owner) {
                        if (this.driverForm.get('ein').value) {
                            this.einNumberChange();
                        }

                        const activeOwnerTab = this.ownerTabs
                            .map((item) => {
                                return {
                                    ...item,
                                    checked:
                                        res.owner?.ownerType.name === item.name,
                                };
                            })
                            .find((item) => item.checked);

                        if (activeOwnerTab) {
                            this.tabOwnerChange(activeOwnerTab);
                        }
                    }

                    if (res.offDutyLocations.length) {
                        for (
                            let index = 0;
                            index < res.offDutyLocations.length;
                            index++
                        ) {
                            this.offDutyLocations.push(
                                this.createOffDutyLocation({
                                    id: res.offDutyLocations[index].id,
                                    nickname:
                                        res.offDutyLocations[index].nickname,
                                    address:
                                        res.offDutyLocations[index].address
                                            .address,
                                    city: res.offDutyLocations[index].address
                                        .city,
                                    state: res.offDutyLocations[index].address
                                        .state,
                                    stateShortName:
                                        res.offDutyLocations[index].address
                                            .stateShortName,
                                    country:
                                        res.offDutyLocations[index].address
                                            .country,
                                    zipCode:
                                        res.offDutyLocations[index].address
                                            .zipCode,
                                    addressUnit:
                                        res.offDutyLocations[index].address
                                            .addressUnit,
                                    street: res.offDutyLocations[index].address
                                        .street,
                                    streetNumber:
                                        res.offDutyLocations[index].address
                                            .streetNumber,
                                })
                            );
                            this.selectedOffDutyAddressArray[index] =
                                res.address;
                        }
                    }
                    this.startFormChanges();
                    setTimeout(() => {
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private deleteDriverById(id: number): void {
        this.driverTService
            .deleteDriverById(id, !this.driverStatus ? 'active' : 'inactive')
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private updateDriverStatus() {
        this.driverTService
            .changeDriverStatus(
                this.editData.id,
                !this.driverStatus ? 'active' : 'inactive'
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: HttpResponseBase) => {
                    if (res.status === 200 || res.status === 204) {
                        this.driverStatus = !this.driverStatus;

                        this.modalService.changeModalStatus({
                            name: 'deactivate',
                            status: this.driverStatus,
                        });
                    }
                },
                error: () => {},
            });
    }

    updateTags() {
        let tags = [];

        this.documents.map((item) => {
            if (item?.tagChanged && item?.fileId) {
                var tagsData = {
                    storageId: item.fileId,
                    tagId: item.tagId?.length ? item.tagId[0] : null,
                };
                tags.push(tagsData);
            }
        });

        if (tags.length) {
            this.tagsService.updateTag({ tags: tags }).subscribe();
        }
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.driverForm);
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
