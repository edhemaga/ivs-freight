import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, map, of, Subject, takeUntil, Observable } from 'rxjs';

import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormGroup,
} from '@angular/forms';

// Third-party modules
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Pipes
import { FormatDatePipe } from '@shared/pipes';
import { AccountInputConfigPipe } from '@pages/new-account/pipes/account-input-config.pipe';

// Components
import {
    CaModalComponent,
    CaInputComponent,
    CaInputNoteComponent,
    CaAppTooltipV2Component,
} from 'ca-components';
import { TaInputDropdownLabelComponent } from '@shared/components/ta-input-dropdown-label/ta-input-dropdown-label.component';

// Models
import {
    AccountColorResponse,
    CompanyAccountLabelResponse,
    CompanyAccountModalResponse,
} from 'appcoretruckassist';
import {
    ICompanyAccountLabel,
    IMappedAccount,
} from '@pages/new-account/interfaces';

// Enums
import {
    eGeneralActions,
    eFormControlName,
    eStringPlaceholder,
} from '@shared/enums';
import { eAccountInputConfigKeys } from '@pages/new-account/enums';

// Assets
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Helpers
import { AccountHelper } from '@pages/new-account/utils/helpers';

// Services
import { AccountService } from '@pages/new-account/services/account.service';
import { AccountStoreService } from '@pages/new-account/state/services/account-store.service';
import { ModalService } from '@shared/services';

@Component({
    selector: 'app-new-account-modal',
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // components
        CaModalComponent,
        CaInputComponent,
        TaInputDropdownLabelComponent,
        CaInputNoteComponent,
        CaAppTooltipV2Component,

        // Pipes
        FormatDatePipe,
        AccountInputConfigPipe,
    ],
    templateUrl: './new-account-modal.component.html',
    styleUrl: './new-account-modal.component.scss',
    standalone: true,
})
export class NewAccountModalComponent implements OnInit, OnDestroy {
    @Input() editData: { id: number; type: string; isEdit: boolean };

    private destroy$ = new Subject<void>();

    // form
    public accountForm: UntypedFormGroup =
        AccountHelper.createAccountModalForm();

    // assets
    public svgRoutes = SharedSvgRoutes;

    public colors!: AccountColorResponse[];
    public accountLabels!: ICompanyAccountLabel[];
    public selectedAccountLabel!: ICompanyAccountLabel;
    public selectedAccountColor!: AccountColorResponse;

    public editAccountData!: IMappedAccount;

    // flags
    public disabledFormValidation: boolean = false;
    public isEditMode!: boolean;

    // enums
    public eGeneralActions = eGeneralActions;
    public eFormControlName = eFormControlName;
    public eStringPlaceholder = eStringPlaceholder;
    public eAccountInputConfigKeys = eAccountInputConfigKeys;

    // actions
    public;

    constructor(
        // services
        private modalService: ModalService,
        private accountService: AccountService,

        // store
        public accountStoreService: AccountStoreService,

        // modal
        private ngbActiveModal: NgbActiveModal
    ) {}

    ngOnInit(): void {
        this.companyAccountColorLabels();
        this.getCompanyAccountModal();
        this.setupModal();
    }

    public onModalAction(
        action:
            | eGeneralActions.DELETE
            | eGeneralActions.SAVE
            | eGeneralActions.SAVE_AND_ADD_NEW
            | eGeneralActions.CLOSE
            | eGeneralActions.DELETE
    ): void {
        switch (action) {
            case eGeneralActions.SAVE:
                const onEditData = {
                    id: this.editData?.id,
                    ...this.accountForm.value,
                    companyAccountLabelId: this.selectedAccountLabel?.id,
                };
                this.accountStoreService.dispatchOnEditAccount(onEditData);
                break;
            case eGeneralActions.SAVE_AND_ADD_NEW:
                const onAddData = {
                    ...this.accountForm.value,
                    companyAccountLabelId: this.selectedAccountLabel?.id,
                };
                this.accountStoreService.dispatchOnAddAccount(onAddData);
                break;
            case eGeneralActions.DELETE:
                this.accountStoreService.dispatchOnDeleteAccount(
                    this.editAccountData,
                    this.ngbActiveModal
                );
                break;
            case eGeneralActions.CLOSE:
                this.modalService.closeModal();
            default:
                return;
        }
    }

    private companyAccountColorLabels(): void {
        this.accountService
            .getCompanyAccountLabelsColorList()
            .pipe(takeUntil(this.destroy$))
            .subscribe((colors: AccountColorResponse[]) => {
                this.colors = colors;
            });
    }

    private getCompanyAccountModal(): void {
        this.accountService
            .getCompanyAccountModal()
            .pipe(
                takeUntil(this.destroy$),
                map(
                    (
                        res: CompanyAccountModalResponse
                    ): ICompanyAccountLabel[] =>
                        res?.labels?.map(
                            (
                                label: CompanyAccountLabelResponse
                            ): ICompanyAccountLabel => ({
                                ...label,
                                dropLabel: true,
                            })
                        )
                )
            )
            .subscribe((res: ICompanyAccountLabel[]) => {
                this.accountLabels = res;
            });
    }

    // TODO Needs to be defined and expanded
    public onSaveLabel(event: unknown): void {}

    public onSelectColorLabel(color: AccountColorResponse): void {
        this.selectedAccountColor = color;

        const { id, name, code, hoverCode } = this.selectedAccountColor || {};

        this.selectedAccountLabel = {
            ...this.selectedAccountLabel,
            colorId: id,
            color: name,
            code,
            hoverCode,
        };
    }

    public onPickExistLabel(label: ICompanyAccountLabel): void {
        this.selectedAccountLabel = label;
    }

    public onCompanyAccountLabelModeChange(mode: boolean) {
        this.disabledFormValidation = mode;
    }

    private setupModal(): void {
        this.isEditMode = this.editData?.isEdit;

        const userData$: Observable<IMappedAccount> = this.isEditMode
            ? this.accountService.getCompanyAccountById(this.editData.id)
            : of(null);

        forkJoin([userData$]).subscribe(([account]) => {
            this.editAccountData = account;
            this.accountForm = AccountHelper.patchAccountModalForm(
                this.accountForm,
                account
            );
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
