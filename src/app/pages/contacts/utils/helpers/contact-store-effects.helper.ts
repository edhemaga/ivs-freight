// components
import { ContactsModalComponent } from '@pages/contacts/pages/contacts-modal/contacts-modal.component';

// enums
import { TableStringEnum } from '@shared/enums';

// services
import { ModalService } from '@shared/services/modal.service';

// models
import { CompanyContactModalResponse } from 'appcoretruckassist';

export class ContactStoreEffectsHelper {
    public static getCreateContactModalData(
        modalService: ModalService,
        contactModalData: CompanyContactModalResponse
    ): void {
        modalService.openModal(
            ContactsModalComponent,
            { size: TableStringEnum.SMALL },
            {
                contactModalData: {
                    ...contactModalData,
                },
            }
        );
    }
}
