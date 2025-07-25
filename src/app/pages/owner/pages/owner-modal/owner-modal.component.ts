import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { merge, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

//Validations
import {
    accountBankValidation,
    addressUnitValidation,
    addressValidation,
    bankValidation,
    businessNameValidation,
    einNumberRegex,
    firstNameValidation,
    lastNameValidation,
    phoneFaxRegex,
    routingBankValidation,
    ssnNumberRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';
//Components
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import {
    CaInputComponent,
    CaInputDropdownComponent,
    CaInputNoteComponent,
    CaModalComponent,
    CaInputAddressDropdownComponent,
    CaTabSwitchComponent,
} from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';

//Models
import {
    OwnerModalResponse,
    OwnerResponse,
    AddressEntity,
    CreateResponse,
} from 'appcoretruckassist';

//Services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { OwnerService } from '@pages/owner/services/owner.service';
import { BankVerificationService } from '@shared/services/bank-verification.service';
import { FormService } from '@shared/services/form.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { AddressService } from '@shared/services/address.service';

// Pipes
import { FormatDatePipe } from '@shared/pipes';
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Enums
import { ContactsModalStringEnum } from '@pages/contacts/pages/contacts-modal/enums';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import {
    eGeneralActions,
    eStringPlaceholder,
    TableStringEnum,
} from '@shared/enums';

// Config
import { OwnerModalConfig } from '@pages/owner/pages/owner-modal/utils/consts';

// mixin
import { AddressMixin } from '@shared/mixins/address/address.mixin';

@Component({
    selector: 'app-owner-modal',
    templateUrl: './owner-modal.component.html',
    styleUrls: ['./owner-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, BankVerificationService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // Component
        CaModalComponent,
        CaInputComponent,
        CaInputDropdownComponent,
        CaInputAddressDropdownComponent,
        TaCustomCardComponent,
        CaInputNoteComponent,
        TaUploadFilesComponent,
        TaAppTooltipV2Component,
        CaTabSwitchComponent,

        // Pipes
        FormatDatePipe,
    ],
})
export class OwnerModalComponent
    extends AddressMixin(
        class {
            addressService!: AddressService;
        }
    )
    implements OnInit, OnDestroy
{
    @Input() editData: any;

    public ownerForm: UntypedFormGroup;

    public selectedTab: number = 1;
    public tabs: any[] = [
        {
            id: 1,
            name: 'Company',
            checked: true,
        },
        {
            id: 2,
            name: 'Sole Proprietor',
        },
    ];

    public labelsBank: any[] = [];
    public selectedAddress: AddressEntity = null;

    public selectedBank: any = null;
    public isBankSelected: boolean = false;

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    public addNewAfterSave: boolean = false;

    public longitude: number;
    public latitude: number;

    public destroy$ = new Subject<void>();

    public isFormDirty: boolean;
    public svgRoutes = SharedSvgRoutes;
    public taModalActionEnum = TaModalActionEnum;
    public ownerModalConfig = OwnerModalConfig;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private ownerModalService: OwnerService,
        private bankVerificationService: BankVerificationService,
        private formService: FormService,
        private ngbActiveModal: NgbActiveModal,
        private confirmationService: ConfirmationService,
        public addressService: AddressService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.getOwnerDropdowns();
        this.onBankSelected();
        this.confirmationActivationSubscribe();
    }

    private confirmationActivationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res.action !== TableStringEnum.CLOSE)
                    this.ngbActiveModal?.close();
            });
    }

    private createForm() {
        this.ownerForm = this.formBuilder.group({
            bussinesName: [
                null,
                [Validators.required, ...businessNameValidation],
            ],
            firstName: [null, [...firstNameValidation]],
            lastName: [null, [...lastNameValidation]],
            ssn: [null, ssnNumberRegex],
            ein: [null, [Validators.required, einNumberRegex]],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            phone: [null, [Validators.required, phoneFaxRegex]],
            email: [null, [Validators.required]],
            bankId: [null, [...bankValidation]],
            accountNumber: [null, accountBankValidation],
            routingNumber: [null, routingBankValidation],
            note: [null],
            files: [null],
        });

        this.inputService.customInputValidator(
            this.ownerForm.get('email'),
            'email',
            this.destroy$
        );
    }

    public tabChange(event: any): void {
        this.selectedTab = event.id;

        this.manipulateWithOwnerInputs();
    }

    public onModalAction(action: string): void {
        switch (action) {
            case TaModalActionEnum.CLOSE:
                if (this.editData?.canOpenModal) {
                    switch (this.editData?.key) {
                        case 'truck-modal':
                            this.modalService.setProjectionModal({
                                action: 'close',
                                payload: {
                                    key: this.editData?.key,
                                    value: null,
                                },
                                component: TruckModalComponent,
                                size: 'small',
                                closing: 'fastest',
                            });
                            break;
                        case 'trailer-modal':
                            this.modalService.setProjectionModal({
                                action: 'close',
                                payload: {
                                    key: this.editData?.key,
                                    value: null,
                                },
                                component: TrailerModalComponent,
                                size: 'small',
                                closing: 'fastest',
                            });
                            break;
                        default:
                            break;
                    }
                }
                this.ngbActiveModal.close();
                break;
            case TaModalActionEnum.SAVE_AND_ADD_NEW:
                if (this.ownerForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.ownerForm);
                    return;
                }
                this.addNewAfterSave = true;
                this.addOwner();
                break;
            case TaModalActionEnum.SAVE:
                if (this.ownerForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.ownerForm);
                    return;
                }
                if (this.editData?.id) this.updateOwner(this.editData.id);
                else this.addOwner();
                break;
            case TaModalActionEnum.DELETE:
                if (this.editData) {
                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            ...this.editData,
                            template: TableStringEnum.OWNER_3,
                            type: TableStringEnum.DELETE,
                            svg: true,
                        }
                    );
                }
                break;
            default:
                break;
        }
    }

    public onHandleAddress(event: {
        address: AddressEntity;
        valid: boolean;
        longLat: any;
    }): void {
        if (!event.valid) return;

        this.selectedAddress = event.address;
        this.longitude = event.longLat.longitude;
        this.latitude = event.longLat.latitude;
    }

    public onSelectBank(event: any): void {
        this.selectedBank = event;
        if (!event) this.ownerForm.get('bankId').patchValue(null);
    }

    public onSaveNewBank(bank: { data: any; action: string }): void {
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
            });
    }

    public onFilesEvent(event: any): void {
        this.documents = event.files;
        switch (event.action) {
            case eGeneralActions.ADD:
                this.ownerForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            case eGeneralActions.DELETE_LOWERCASE:
                this.ownerForm
                    .get('files')
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );
                if (event.deleteId) {
                    this.filesForDelete.push(event.deleteId);
                }
                this.fileModified = true;
                break;
            default:
                break;
        }
    }

    private manipulateWithOwnerInputs(): void {
        if (this.selectedTab === 1) {
            this.inputService.changeValidators(
                this.ownerForm.get('bussinesName')
            );
            this.inputService.changeValidators(
                this.ownerForm.get('ein'),
                true,
                [einNumberRegex]
            );

            merge(
                this.ownerForm.get('bussinesName').valueChanges,
                this.ownerForm.get('ein').valueChanges
            )
                .pipe(takeUntil(this.destroy$))
                .subscribe((val: string) => {
                    if (val) {
                        this.inputService.changeValidators(
                            this.ownerForm.get('firstName'),
                            false
                        );
                        this.inputService.changeValidators(
                            this.ownerForm.get('lastName'),
                            false
                        );
                        this.inputService.changeValidators(
                            this.ownerForm.get('ssn'),
                            false
                        );
                    }
                });
        } else {
            this.inputService.changeValidators(this.ownerForm.get('firstName'));
            this.inputService.changeValidators(this.ownerForm.get('lastName'));
            this.inputService.changeValidators(
                this.ownerForm.get('ssn'),
                true,
                [ssnNumberRegex]
            );

            merge(
                this.ownerForm.get('firstName').valueChanges,
                this.ownerForm.get('lastName').valueChanges,
                this.ownerForm.get('ssn').valueChanges
            )
                .pipe(takeUntil(this.destroy$))
                .subscribe((val: string) => {
                    if (val) {
                        this.inputService.changeValidators(
                            this.ownerForm.get('bussinesName'),
                            false
                        );
                        this.inputService.changeValidators(
                            this.ownerForm.get('ein'),
                            false
                        );
                    }
                });
        }
    }

    private onBankSelected() {
        this.ownerForm
            .get('bankId')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                const timeout = setTimeout(async () => {
                    this.isBankSelected =
                        await this.bankVerificationService.onSelectBank(
                            this.selectedBank ? this.selectedBank.name : null,
                            this.ownerForm.get('routingNumber'),
                            this.ownerForm.get('accountNumber')
                        );
                    clearTimeout(timeout);
                }, 100);
            });
    }

    private updateOwner(id: number) {
        const {
            bussinesName,
            firstName,
            lastName,
            ssn,
            ein,
            addressUnit,
            ...form
        } = this.ownerForm.value;

        const newData: any = {
            id: id,
            ...form,
            ownerType: this.selectedTab,
            name:
                this.selectedTab === 1
                    ? bussinesName
                    : firstName.concat(' ', lastName),
            ssnEin: this.selectedTab === 1 ? ein : ssn,
            address: {
                ...this.selectedAddress,
                addressUnit,
            },
            bankId: this.selectedBank ? this.selectedBank.id : null,
            files: this.ownerForm.value.files,
            filesForDeleteIds: this.filesForDelete,
            longitude: this.longitude,
            latitude: this.latitude,
        };

        this.ownerModalService
            .updateOwner(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.ngbActiveModal.close();
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

    private addOwner() {
        const {
            bussinesName,
            firstName,
            lastName,
            ssn,
            ein,
            addressUnit,
            ...form
        } = this.ownerForm.value;

        const newData: any = {
            ...form,
            ownerType: this.selectedTab,
            name:
                this.selectedTab === 1
                    ? bussinesName
                    : firstName.concat(' ', lastName),
            ssnEin: this.selectedTab === 1 ? ein : ssn,
            address: {
                ...this.selectedAddress,
                addressUnit,
            },
            bankId: this.selectedBank ? this.selectedBank.id : null,
            files: this.ownerForm.value.files,
            longitude: this.longitude,
            latitude: this.latitude,
        };

        this.ownerModalService
            .addOwner(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.editData?.canOpenModal) {
                        this.modalService.setModalSpinner({
                            action: null,
                            status: false,
                            close: true,
                        });
                        switch (this.editData?.key) {
                            case 'truck-modal':
                                this.modalService.setProjectionModal({
                                    action: 'close',
                                    payload: {
                                        key: this.editData?.key,
                                        value: null,
                                    },
                                    component: TruckModalComponent,
                                    size: 'small',
                                    closing: 'slowlest',
                                });
                                break;
                            case 'trailer-modal':
                                this.modalService.setProjectionModal({
                                    action: 'close',
                                    payload: {
                                        key: this.editData?.key,
                                        value: null,
                                    },
                                    component: TrailerModalComponent,
                                    size: 'small',
                                    closing: 'slowlest',
                                });
                                break;
                            default:
                                break;
                        }
                    }

                    if (this.addNewAfterSave) {
                        this.ngbActiveModal.close();
                        this.modalService.openModal(OwnerModalComponent, {
                            size: ContactsModalStringEnum.SMALL,
                        });
                    } else this.ngbActiveModal.close();
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

    private editOwnerById(id: number) {
        this.ownerModalService
            .getOwnerById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: OwnerResponse) => {
                    const splitName =
                        res.ownerType.id === 2
                            ? res.name.split(eStringPlaceholder.WHITESPACE)
                            : null;

                    this.ownerForm.patchValue({
                        ...res,
                        bussinesName: res.ownerType.id === 1 ? res.name : null,
                        firstName: res.ownerType.id === 2 ? splitName[0] : null,
                        lastName: res.ownerType.id === 2 ? splitName[1] : null,
                        ssn: res.ownerType.id === 2 ? res.ssnEin : null,
                        ein: res.ownerType.id === 1 ? res.ssnEin : null,
                        address: res.address,
                        addressUnit: res.address.addressUnit,
                        bankId: res?.bank?.name ?? null,
                    });
                    this.selectedAddress = res.address;
                    this.selectedBank = res.bank;
                    this.isBankSelected = !!this.selectedBank;
                    this.documents = res.files;

                    this.tabChange(
                        this.tabs.find((item) => item.id === res.ownerType.id)
                    );

                    this.startFormChanges();
                },
            });
    }

    private getOwnerDropdowns(): void {
        this.ownerModalService
            .getOwnerDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: OwnerModalResponse) => {
                    this.labelsBank = res.banks;

                    if (this.editData?.id) {
                        this.editOwnerById(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
            });
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.ownerForm);
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
