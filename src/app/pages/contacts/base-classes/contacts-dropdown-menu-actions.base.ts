import { Subject, takeUntil } from 'rxjs';

// base classes
import { DropdownMenuActionsBase } from '@shared/base-classes';

// services
import { ModalService } from '@shared/services/modal.service';
import { ContactsService } from '@shared/services/contacts.service';

// enums
import { DropdownMenuStringEnum } from '@shared/enums';

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

    constructor(
        // services
        protected modalService: ModalService,
        protected contactsService: ContactsService
    ) {
        super(modalService);
    }

    protected handleDropdownMenuActions<T extends CompanyContactResponse>(
        event: TableCardBodyActions<T>,
        tableType: string
    ) {
        const { id, data, type } = event;

        switch (type) {
            case DropdownMenuStringEnum.SEND_SMS_TYPE:
                this.handleSendSmsAction();

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
                super.handleDropdownMenuActions(event, tableType);

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
}
