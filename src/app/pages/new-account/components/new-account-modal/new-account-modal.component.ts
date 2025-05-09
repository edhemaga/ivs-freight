import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { map, Subject, switchMap, takeUntil } from 'rxjs';

import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormGroup,
} from '@angular/forms';

// Third-party modules
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
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
    CompanyAccountModalResponse,
} from 'appcoretruckassist';
import { ICompanyAccountLabel } from '@pages/new-account/interfaces';

// Enums
import {
    eGeneralActions,
    eFormControlName,
    eStringPlaceholder,
} from '@shared/enums';
import { eAccountInputConfigKeys } from '@pages/new-account/enums';

// Assets
import { SharedSvgRoutes } from '@shared/utils/svg-routes';
import { AccountHelper } from '@pages/new-account/utils/helpers';

// Services
import { AccountService } from '@pages/new-account/services/account.service';
import { CompanyAccountLabelResponse } from '../../../../../../appcoretruckassist/model/companyAccountLabelResponse';
import { AccountStoreService } from '@pages/new-account/state/services/account-store.service';
import { IMappedAccount } from '../../interfaces/mapped-account.interface';

@Component({
    selector: 'app-new-account-modal',
    standalone: true,
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
})
export class NewAccountModalComponent implements OnInit, OnDestroy {
    @Input() editData: { id: number; type: string };

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

    // flags
    public disabledFormValidation: boolean = false;

    // enums
    public eGeneralActions = eGeneralActions;
    public eFormControlName = eFormControlName;
    public eStringPlaceholder = eStringPlaceholder;
    public eAccountInputConfigKeys = eAccountInputConfigKeys;

    constructor(
        private accountService: AccountService,
        public accountStoreService: AccountStoreService
    ) {}

    ngOnInit(): void {
        this.companyAccountColorLabels();
        this.getCompanyAccountModal();
        this.getSelectedAccount();
    }

    public onModalAction(
        action:
            | eGeneralActions.DELETE
            | eGeneralActions.SAVE
            | eGeneralActions.SAVE_AND_ADD_NEW
    ): void {
        switch (action) {
            case eGeneralActions.SAVE:
                this.accountStoreService.dispatchOnAddAccount({
                    ...this.accountForm.value,
                    companyAccountLabelId: this.selectedAccountLabel.id,
                });
                break;
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
    public onSaveLabel(event): void {}

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

    public getSelectedAccount(): void {
        this.accountStoreService.selectAccountById(this.editData?.id);
        this.accountStoreService.accountSelector$
            .pipe(takeUntil(this.destroy$))
            .subscribe((account: IMappedAccount) => {
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
