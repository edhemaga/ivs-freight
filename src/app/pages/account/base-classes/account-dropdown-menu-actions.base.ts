import { Clipboard } from '@angular/cdk/clipboard';

import { Subject, takeUntil } from 'rxjs';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { AccountService } from '@pages/account/services/account.service';

// enums
import { eDropdownMenu } from '@shared/enums';

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

    // document ref
    protected abstract documentRef: Document;

    // clipboard
    protected abstract clipboard: Clipboard;

    // services
    protected abstract accountService: AccountService;

    constructor() {
        super();
    }

    protected handleDropdownMenuActions<T extends AccountResponse>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const { id, data, type } = action;

        switch (type) {
            case eDropdownMenu.GO_TO_LINK_TYPE:
                const { url } = data;

                this.handleGoToLinkAction(url);

                break;
            case eDropdownMenu.COPY_USERNAME_TYPE:
                const { username } = data;

                this.handleCopyAction(username);

                break;
            case eDropdownMenu.COPY_PASSWORD_TYPE:
                const { password } = data;

                this.handleCopyAction(password);

                break;
            case eDropdownMenu.CREATE_LABEL:
                this.handleCreateLabelAction(data);

                break;
            case eDropdownMenu.UPDATE_LABEL:
                const { id: labelId } = data;

                this.handleUpdateLabelAction(id, labelId);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(action, tableType);

                break;
        }
    }

    private handleGoToLinkAction(url: string): void {
        const linkUrl = AccountHelper.generateLinkUrl(url);

        this.documentRef.defaultView.open(linkUrl, eDropdownMenu.BLANK);
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
