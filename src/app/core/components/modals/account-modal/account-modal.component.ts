import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnDestroy,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import {
    AccountColorResponse,
    CompanyAccountModalResponse,
    CompanyAccountResponse,
    CreateCompanyAccountCommand,
    CreateResponse,
    UpdateCompanyAccountCommand,
} from 'appcoretruckassist';

import { ModalService } from '../../shared/ta-modal/modal.service';
import { AccountTService } from '../../account/state/account.service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import {
    labelValidation,
    urlValidation,
    usernameValidation,
} from '../../shared/ta-input/ta-input.regex-validations';
import { FormService } from '../../../services/form/form.service';
import { passwordAccountValidation } from '../../shared/ta-input/ta-input.regex-validations';

@Component({
    selector: 'app-account-modal',
    templateUrl: './account-modal.component.html',
    styleUrls: ['./account-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, FormService],
})
export class AccountModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @Input() editData: any;

    public accountForm: UntypedFormGroup;

    public accountLabels: any[] = [];
    public selectedAccountLabel: any = null;

    public colors: any[] = [];
    public selectedAccountColor: any;

    public isFormDirty: boolean;

    public addNewAfterSave: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private accountService: AccountTService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.companyAccountModal();
        this.companyAccountColorLabels();

        if (this.editData) {
            this.editCompanyAccount(this.editData.id);
        }

        this.inputService.customInputValidator(
            this.accountForm.get('url'),
            'url',
            this.destroy$
        );
    }

    private createForm(): void {
        this.accountForm = this.formBuilder.group({
            name: [null, [Validators.required, ...labelValidation]],
            username: [null, [Validators.required, ...usernameValidation]],
            password: [
                null,
                [Validators.required, ...passwordAccountValidation],
            ],
            url: [null, urlValidation],
            companyAccountLabelId: [null],
            note: [null],
        });

        this.inputService.customInputValidator(
            this.accountForm.get('url'),
            'url',
            this.destroy$
        );

        this.formService.checkFormChange(this.accountForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange && !this.disabledFormValidation;
            });
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save and add new': {
                if (this.accountForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.accountForm);
                    return;
                }
                this.addCompanyAccount();
                this.modalService.setModalSpinner({
                    action: 'save and add new',
                    status: true,
                    close: false,
                });
                this.addNewAfterSave = true;
                break;
            }
            case 'save': {
                // If Form not valid
                if (this.accountForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.accountForm);
                    return;
                }
                if (this.editData) {
                    this.updateCompanyAccount(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addCompanyAccount();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            }
            case 'delete': {
                if (this.editData) {
                    this.deleteCompanyAccountById(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: 'delete',
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

    private companyAccountModal(): void {
        this.accountService
            .companyAccountModal()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CompanyAccountModalResponse) => {
                    this.accountLabels = res.labels.map((item) => {
                        return { ...item, dropLabel: true };
                    });
                },
            });
    }

    private companyAccountColorLabels() {
        this.accountService
            .companyAccountLabelsColorList()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: Array<AccountColorResponse>) => {
                    this.colors = res;
                },
                error: () => {},
            });
    }

    private editCompanyAccount(id: number) {
        this.accountService
            .getCompanyAccountById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CompanyAccountResponse) => {
                    this.accountForm.patchValue({
                        name: res.name,
                        username: res.username,
                        password: res.password,
                        url: res.url,
                        companyAccountLabelId: res.companyAccountLabel
                            ? res.companyAccountLabel.name
                            : null,
                        note: res.note,
                    });
                    this.selectedAccountLabel = res.companyAccountLabel;
                },
                error: () => {},
            });
    }

    private addCompanyAccount(): void {
        const newData: CreateCompanyAccountCommand = {
            ...this.accountForm.value,
            api: 1,
            apiCategory: 'EFSFUEL',
            companyAccountLabelId: this.selectedAccountLabel
                ? this.selectedAccountLabel.id
                : null,
        };
        this.accountService
            .addCompanyAccount(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.addNewAfterSave) {
                        this.modalService.setModalSpinner({
                            action: 'save and add new',
                            status: false,
                            close: false,
                        });
                        this.formService.resetForm(this.accountForm);

                        this.selectedAccountColor = null;
                        this.selectedAccountLabel = null;

                        this.addNewAfterSave = false;
                    } else {
                        this.modalService.setModalSpinner({
                            action: null,
                            status: false,
                            close: true,
                        });
                    }
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

    private updateCompanyAccount(id: number): void {
        const newData: UpdateCompanyAccountCommand = {
            id: id,
            ...this.accountForm.value,
            api: 1,
            apiCategory: 'EFSFUEL',
            companyAccountLabelId: this.selectedAccountLabel
                ? this.selectedAccountLabel.id
                : null,
        };
        this.accountService
            .updateCompanyAccount(newData)
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

    public deleteCompanyAccountById(id: number): void {
        this.accountService
            .deleteCompanyAccountById(id)
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

    public onPickExistLabel(event: any) {
        this.selectedAccountLabel = event;
    }

    public onSelectColorLabel(event: any): void {
        this.selectedAccountColor = event;
        this.selectedAccountLabel = {
            ...this.selectedAccountLabel,
            colorId: this.selectedAccountColor.id,
            color: this.selectedAccountColor.name,
            code: this.selectedAccountColor.code,
            hoverCode: this.selectedAccountColor.hoverCode,
        };
    }

    public onSaveLabel(data: { data: any; action: string }) {
        switch (data.action) {
            case 'edit': {
                this.selectedAccountLabel = data.data;
                this.accountService
                    .updateCompanyAccountLabel({
                        id: this.selectedAccountLabel.id,
                        name: this.selectedAccountLabel.name,
                        colorId: this.selectedAccountLabel.colorId,
                    })
                    .pipe(
                        takeUntil(this.destroy$),
                        switchMap(() => {
                            return this.accountService.companyAccountModal();
                        })
                    )
                    .subscribe({
                        next: (res: CompanyAccountModalResponse) => {
                            this.accountLabels = res.labels;
                        },
                        error: () => {},
                    });
                break;
            }
            case 'new': {
                this.selectedAccountLabel = {
                    id: data.data.id,
                    name: data.data.name,
                    code: this.selectedAccountColor
                        ? this.selectedAccountColor.code
                        : this.colors[this.colors.length - 1].code,
                    hoverCode: this.selectedAccountColor
                        ? this.selectedAccountColor.hoverCode
                        : this.colors[this.colors.length - 1].hoverCode,
                    count: 0,
                    colorId: this.selectedAccountColor
                        ? this.selectedAccountColor.id
                        : this.colors[this.colors.length - 1].id,
                    color: this.selectedAccountColor
                        ? this.selectedAccountColor.name
                        : this.colors[this.colors.length - 1].name,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                this.accountService
                    .addCompanyAccountLabel({
                        name: this.selectedAccountLabel.name,
                        colorId: this.selectedAccountLabel.colorId,
                    })
                    .pipe(
                        takeUntil(this.destroy$),
                        switchMap((res: CreateResponse) => {
                            this.selectedAccountLabel = {
                                ...this.selectedAccountLabel,
                                id: res.id,
                            };
                            return this.accountService.companyAccountModal();
                        })
                    )
                    .subscribe({
                        next: (res: CompanyAccountModalResponse) => {
                            this.accountLabels = res.labels;
                        },
                        error: () => {},
                    });

                break;
            }
            default: {
                break;
            }
        }
    }

    public disabledFormValidation: boolean = false;
    public companyAccountLabelMode(event: boolean) {
        this.disabledFormValidation = event;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
