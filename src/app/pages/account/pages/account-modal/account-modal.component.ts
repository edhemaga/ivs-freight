import { CommonModule } from '@angular/common';
import {
    FormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnDestroy,
} from '@angular/core';

import { Subject, switchMap, takeUntil } from 'rxjs';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { AccountService } from '@pages/account/services/account.service';
import { ModalService } from '@shared/services/modal.service';
import { FormService } from '@shared/services/form.service';

// validations
import {
    labelValidation,
    urlValidation,
    usernameValidation,
    passwordAccountValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// components
import { TaInputDropdownLabelComponent } from '@shared/components/ta-input-dropdown-label/ta-input-dropdown-label.component';
import {
    CaInputComponent,
    CaInputNoteComponent,
    CaModalComponent,
} from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// models
import {
    AccountColorResponse,
    CompanyAccountModalResponse,
    CompanyAccountResponse,
    CreateCompanyAccountCommand,
    CreateResponse,
    UpdateCompanyAccountCommand,
} from 'appcoretruckassist';

// Config
import { AccountModalConfig } from '@pages/account/utils/account-modal.config';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-account-modal',
    templateUrl: './account-modal.component.html',
    styleUrls: ['./account-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // components
        CaModalComponent,
        CaInputComponent,
        TaInputDropdownLabelComponent,
        CaInputNoteComponent,
        TaAppTooltipV2Component,
    ],
})
export class AccountModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public accountForm: UntypedFormGroup;

    public accountLabels: any[] = [];
    public selectedAccountLabel: any = null;

    public colors: any[] = [];
    public selectedAccountColor: any;

    public isFormDirty: boolean;

    public addNewAfterSave: boolean = false;

    public disabledFormValidation: boolean = false;

    private destroy$ = new Subject<void>();
    public accountModalConfig = AccountModalConfig;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private accountService: AccountService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.companyAccountModal();
        this.companyAccountColorLabels();
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
    }

    public onModalAction(action: string): void {
        switch (action) {
            case 'close': {
                break;
            }
            case 'save and add new': {
                if (this.accountForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.accountForm);
                    return;
                }
                this.addCompanyAccount();
                this.setModalSpinner('save and add new', true, false);
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
                    this.setModalSpinner(null, true, false);
                } else {
                    this.addCompanyAccount();
                    this.setModalSpinner(null, true, false);
                }
                break;
            }
            case 'delete': {
                if (this.editData) {
                    this.deleteCompanyAccountById(this.editData.id);
                    this.setModalSpinner('delete', true, false);
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

                    if (this.editData) {
                        this.editCompanyAccount(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
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
                    this.startFormChanges();
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
                        this.formService.resetForm(this.accountForm);

                        this.selectedAccountColor = null;
                        this.selectedAccountLabel = null;

                        this.addNewAfterSave = false;

                        this.setModalSpinner('save and add new', false, false);
                    } else {
                        this.setModalSpinner(null, true, true);
                    }
                },
                error: () => {
                    this.setModalSpinner(null, false, false);
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
                    this.setModalSpinner(null, true, true);
                },
                error: () => {
                    this.setModalSpinner(null, false, false);
                },
            });
    }

    public deleteCompanyAccountById(id: number): void {
        this.accountService
            .deleteCompanyAccountById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.setModalSpinner('delete', true, true);
                },
                error: () => {
                    this.setModalSpinner('delete', false, false);
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

    public companyAccountLabelMode(event: boolean) {
        this.disabledFormValidation = event;
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.accountForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    private setModalSpinner(
        action: string,
        status: boolean,
        close: boolean
    ): void {
        this.modalService.setModalSpinner({
            action,
            status,
            close,
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
