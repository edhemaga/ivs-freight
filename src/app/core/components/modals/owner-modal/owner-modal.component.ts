import {
    accountBankValidation,
    routingBankValidation,
} from '../../shared/ta-input/ta-input.regex-validations';
import { TruckModalComponent } from '../truck-modal/truck-modal.component';
import { OwnerResponse } from '../../../../../../appcoretruckassist';
import { OwnerModalResponse } from '../../../../../../appcoretruckassist';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { AddressEntity, CreateResponse } from 'appcoretruckassist';
import { TabSwitcherComponent } from '../../switchers/tab-switcher/tab-switcher.component';
import {
    addressUnitValidation,
    addressValidation,
    bankValidation,
    businessNameValidation,
    einNumberRegex,
    firstNameValidation,
    lastNameValidation,
    phoneFaxRegex,
    ssnNumberRegex,
} from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { OwnerTService } from '../../owner/state/owner.service';
import { TrailerModalComponent } from '../trailer-modal/trailer-modal.component';
import { Subject, takeUntil, merge } from 'rxjs';
import { BankVerificationService } from '../../../services/BANK-VERIFICATION/bankVerification.service';
import { FormService } from '../../../services/form/form.service';

@Component({
    selector: 'app-owner-modal',
    templateUrl: './owner-modal.component.html',
    styleUrls: ['./owner-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, BankVerificationService, FormService],
})
export class OwnerModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @ViewChild(TabSwitcherComponent) tabSwitcher: any;

    @Input() editData: any;

    public isFormDirty: boolean;

    public ownerForm: FormGroup;

    public selectedTab: number = 1;
    public tabs: any[] = [
        {
            id: 1,
            name: 'Company',
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

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private ownerModalService: OwnerTService,
        private bankVerificationService: BankVerificationService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getOwnerDropdowns();
        this.onBankSelected();

        if (this.editData?.id) {
            this.editOwnerById(this.editData.id);
        }
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

        this.formService.checkFormChange(this.ownerForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
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

        this.manipulateWithOwnerInputs();
    }

    private manipulateWithOwnerInputs() {
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

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                if (this.editData?.canOpenModal) {
                    switch (this.editData?.key) {
                        case 'truck-modal': {
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
                        }
                        case 'trailer-modal': {
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
                        }
                        default: {
                            break;
                        }
                    }
                }
                break;
            }
            case 'save and add new': {
                if (this.ownerForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.ownerForm);
                    return;
                }
                this.addOwner();
                this.modalService.setModalSpinner({
                    action: 'save and add new',
                    status: true,
                });
                this.addNewAfterSave = true;
                break;
            }
            case 'save': {
                if (this.ownerForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.ownerForm);
                    return;
                }
                if (this.editData?.id) {
                    this.updateOwner(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                    });
                } else {
                    this.addOwner();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        setFasterTimeout: !!this.editData?.canOpenModal,
                    });
                }

                break;
            }
            case 'delete': {
                this.deleteOwnerById(this.editData.id);
                this.modalService.setModalSpinner({
                    action: 'delete',
                    status: true,
                });
                break;
            }
            default: {
                break;
            }
        }
    }

    public onHandleAddress(event: { address: AddressEntity; valid: boolean }) {
        if (event.valid) this.selectedAddress = event.address;
    }

    public onSelectBank(event: any): void {
        this.selectedBank = event;
        if (!event) {
            this.ownerForm.get('bankId').patchValue(null);
        }
    }

    public onSaveNewBank(bank: { data: any; action: string }) {
        this.selectedBank = bank.data;
        console.log('save bank: ', bank);
        this.bankVerificationService
            .createBank({ name: bank.data.name })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CreateResponse) => {
                    this.selectedBank = {
                        id: res.id,
                        name: bank.data.name,
                    };
                    console.log('selected bank: ', this.selectedBank);
                    this.labelsBank = [...this.labelsBank, this.selectedBank];
                },
                error: () => {},
            });
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

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const newData: any = {
            id: id,
            ...form,
            ownerType: this.selectedTab,
            name:
                this.selectedTab === 1
                    ? bussinesName
                    : firstName.concat(' ', lastName),
            ssnEin: this.selectedTab === 1 ? ein : ssn,
            address: { ...this.selectedAddress, addressUnit: addressUnit },
            bankId: this.selectedBank ? this.selectedBank.id : null,
            files: documents ? documents : this.ownerForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        this.ownerModalService
            .updateOwner(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private deleteOwnerById(id: number) {
        this.ownerModalService
            .deleteOwnerById(id, this.editData.selectedTab)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
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

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const newData: any = {
            ...form,
            ownerType: this.selectedTab,
            name:
                this.selectedTab === 1
                    ? bussinesName
                    : firstName.concat(' ', lastName),
            ssnEin: this.selectedTab === 1 ? ein : ssn,
            address: { ...this.selectedAddress, addressUnit: addressUnit },
            bankId: this.selectedBank ? this.selectedBank.id : null,
            files: documents,
        };

        this.ownerModalService
            .addOwner(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.editData?.canOpenModal) {
                        switch (this.editData?.key) {
                            case 'truck-modal': {
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
                            }
                            case 'trailer-modal': {
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
                            }
                            default: {
                                break;
                            }
                        }
                    }

                    if (this.addNewAfterSave) {
                        this.modalService.setModalSpinner({
                            action: 'save and add new',
                            status: false,
                        });
                        this.formService.resetForm(this.ownerForm);

                        this.selectedAddress = null;
                        this.selectedBank = null;
                        this.selectedTab = 1;
                        this.tabs = this.tabs.map((item, index) => {
                            return {
                                ...item,
                                checked: index === 0,
                            };
                        });

                        this.addNewAfterSave = false;
                    }
                },
                error: () => {},
            });
    }

    private editOwnerById(id: number) {
        this.ownerModalService
            .getOwnerById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: OwnerResponse) => {
                    const splitName =
                        res.ownerType.id === 2 ? res.name.split(' ') : null;

                    this.ownerForm.patchValue({
                        bussinesName: res.ownerType.id === 1 ? res.name : null,
                        firstName: res.ownerType.id === 2 ? splitName[0] : null,
                        lastName: res.ownerType.id === 2 ? splitName[1] : null,
                        ssn: res.ownerType.id === 2 ? res.ssnEin : null,
                        ein: res.ownerType.id === 1 ? res.ssnEin : null,
                        address: res.address.address,
                        addressUnit: res.address.addressUnit,
                        phone: res.phone,
                        email: res.email,
                        bankId: res?.bank?.name ? res.bank.name : null,
                        accountNumber: res.accountNumber,
                        routingNumber: res.routingNumber,
                        note: res.note,
                    });
                    this.selectedAddress = res.address;
                    this.selectedBank = res.bank;
                    this.documents = res.files;
                    this.tabChange(
                        this.tabs.find((item) => item.id === res.ownerType.id)
                    );
                },
                error: () => {},
            });
    }

    private getOwnerDropdowns() {
        this.ownerModalService
            .getOwnerDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: OwnerModalResponse) => {
                    this.labelsBank = res.banks;
                },
                error: () => {},
            });
    }

    public onFilesEvent(event: any) {
        this.documents = event.files;
        switch (event.action) {
            case 'add': {
                this.ownerForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
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
            }
            default: {
                break;
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
