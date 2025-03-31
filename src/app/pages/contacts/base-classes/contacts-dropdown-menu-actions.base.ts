import { Subject, takeUntil } from 'rxjs';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { ContactsService } from '@shared/services/contacts.service';

// enums
import { eDropdownMenu } from '@shared/enums';

// models
import { TableCardBodyActions } from '@shared/models';
import {
    CompanyAccountLabelResponse,
    CompanyContactResponse,
    UpdateCompanyContactCommand,
} from 'appcoretruckassist';

export abstract class ContactsDropdownMenuActionsBase extends DropdownMenuActionsBase {
    protected abstract destroy$: Subject<void>;
    protected abstract viewData: CompanyContactResponse[];

    // services
    protected abstract contactsService: ContactsService;

    constructor() {
        super();
    }

    protected handleDropdownMenuActions<T extends CompanyContactResponse>(
        action: TableCardBodyActions<T>,
        tableType: string
    ) {
        const { id, data, type } = action;

        switch (type) {
            case eDropdownMenu.SEND_SMS_TYPE:
                this.handleSendSmsAction();

                break;
            case eDropdownMenu.CREATE_LABEL:
                this.handleCreateLabelAction(data);

                break;
            case eDropdownMenu.UPDATE_LABEL:
                const { id: labelId } = data;

                this.handleUpdateLabelAction(id, labelId);

                break;
            case eDropdownMenu.DELETE_TYPE:
                this.handleContactDeleteAction(action, tableType);

                break;
            default:
                // call the parent class method to handle shared cases
                super.handleSharedDropdownMenuActions(action, tableType);

                break;
        }
    }

    private handleSendSmsAction(): void {}

    private handleCreateLabelAction(data: CompanyAccountLabelResponse): void {
        const { id, name, colorId } = data;

        const label = {
            id,
            name,
            colorId,
        };

        this.contactsService
            .updateCompanyContactLabel(label)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private handleUpdateLabelAction(id: number, labelId: number): void {
        const companyContactData = this.viewData.find(
            (contact) => contact.id === id
        );

        const { name } = companyContactData;

        const newdata: UpdateCompanyContactCommand = {
            /* name,
                companyContactLabelId: labelId */
        };

        this.contactsService
            .updateCompanyContact(newdata)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private handleContactDeleteAction<T extends CompanyContactResponse>(
        action: TableCardBodyActions<T>,
        tableType: string
    ): void {
        const adjustedAction = {
            ...action,
            svg: true,
        };

        super.handleSharedDropdownMenuActions(adjustedAction, tableType);
    }
}
