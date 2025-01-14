import { DOCUMENT } from '@angular/common';
import { Inject, Optional, SkipSelf } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

import { Subject, takeUntil } from 'rxjs';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { ModalService } from '@shared/services/modal.service';
import { AccountService } from '@pages/account/services/account.service';

// enums
import { DropdownMenuStringEnum } from '@shared/enums';

// helpers
import { AccountHelper } from '@pages/account/utils/helpers';

// models
import { TableCardBodyActions } from '@shared/models';
import { AccountResponse } from '@pages/account/pages/account-table/models/account-response.model';
import {
    CompanyAccountLabelResponse,
    UpdateCompanyAccountCommand,
} from 'appcoretruckassist';

export abstract class AccountDropdownMenuActionsBase extends DropdownMenuActionsBase {
    protected abstract destroy$: Subject<void>;
    protected abstract viewData: AccountResponse[];

    constructor(
        @Inject(DOCUMENT) protected documentRef: Document,

        // clipboard
        protected clipboard: Clipboard,

        // services
        protected modalService: ModalService,

        // optional injections
        @Optional() @SkipSelf() protected accountService?: AccountService
    ) {
        super(modalService);
    }

    protected handleDropdowMenuActions<T extends AccountResponse>(
        event: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { id, data, type } = event;

        switch (type) {
            case DropdownMenuStringEnum.GO_TO_LINK_TYPE:
                const { url } = data;

                this.handleGoToLinkAction(url);

                break;
            case DropdownMenuStringEnum.COPY_USERNAME_TYPE:
                const { username } = data;

                this.handleCopyAction(username);

                break;
            case DropdownMenuStringEnum.COPY_PASSWORD_TYPE:
                const { password } = data;

                this.handleCopyAction(password);

                break;
            case DropdownMenuStringEnum.CREATE_LABEL:
                this.handleCreateLabelAction(data);

                break;
            case DropdownMenuStringEnum.UPDATE_LABEL:
                const { id: labelId } = data;

                this.handleUpdateLabelAction(id, labelId);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleDropdowMenuActions(event, tableType);

                break;
        }
    }

    private handleGoToLinkAction(url: string): void {
        const linkUrl = AccountHelper.generateUrlLink(url);

        this.documentRef.defaultView.open(
            linkUrl,
            DropdownMenuStringEnum.BLANK
        );
    }

    private handleCopyAction(usernameOrPassword: string): void {
        this.clipboard.copy(usernameOrPassword);
    }

    private handleCreateLabelAction(data: CompanyAccountLabelResponse): void {
        const { id, name, colorId } = data;

        const label = {
            id,
            name,
            colorId,
        };

        this.accountService
            .updateCompanyAccountLabel(label)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private handleUpdateLabelAction(id: number, labelId: number): void {
        const companyAccountData = this.viewData.find(
            (account) => account.id === id
        );

        const { name, username, password, url, note } = companyAccountData;

        const newdata: UpdateCompanyAccountCommand = {
            id,
            name,
            username,
            password,
            url,
            companyAccountLabelId: labelId,
            note,
        };

        this.accountService
            .updateCompanyAccount(newdata)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }
}
