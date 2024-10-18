import { Component, Input, ViewEncapsulation } from '@angular/core';

//Modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

//Components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

//Pipes
import { FormatPhonePipe } from '@shared/pipes/format-phone.pipe';

//Models
import { DepartmentContacts } from '@shared/models/department-contacts.model';
import { BrokerResponse, ShipperResponse } from 'appcoretruckassist';

//Services
import { DropDownService } from '@shared/services/drop-down.service';
import { ModalService } from '@shared/services/modal.service';
import { DetailsDataService } from '@shared/services/details-data.service';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

//Constants
import { ContactsCardSvgRoutes } from '@shared/components/ta-contacts-card/utils/svg-routes/contacts-card-svg-routes';

//Modules
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ta-contacts-card',
    templateUrl: './ta-contacts-card.component.html',
    styleUrls: ['./ta-contacts-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        //Moduless
        CommonModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        //Components
        TaCustomCardComponent,
        TaCopyComponent,

        //Pipes
        FormatPhonePipe,
    ],
})
export class TaContactsCardComponent {
    @Input() public type: string;
    @Input() public departmentContacts: DepartmentContacts[];
    @Input() public viewData: BrokerResponse | ShipperResponse;

    public contactsImageRoutes = ContactsCardSvgRoutes;

    constructor(
        private dropDownService: DropDownService,
        private modalService: ModalService,
        private DetailsDataService: DetailsDataService
    ) {}

    public identity(index: number, item: DepartmentContacts): number {
        return item.id;
    }

    public editContact(): void {
        const eventObject = {
            data: this.viewData,
            id: this.viewData.id,
            type: TableStringEnum.EDIT,
            openedTab: TableStringEnum.ADDITIONAL,
        };
        setTimeout(() => {
            this.dropDownService.dropActionsHeaderShipperBroker(
                eventObject,
                this.viewData,
                this.type
            );
        }, 100);
    }

    public deleteContactModal(contactData): void {
        this.DetailsDataService.setContactName(contactData.fullName);

        const mappedEvent = {
            id: contactData.id,
            data: { ...contactData, businessName: this.viewData.businessName },
        };

        this.modalService.openModal(
            ConfirmationModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...mappedEvent,
                modalHeaderTitle: TableStringEnum.DELTETE_CONTACT_2,
                template:
                    this.type === TableStringEnum.BROKER
                        ? TableStringEnum.BROKER_CONTACT
                        : TableStringEnum.SHIPPER_CONTACT,
                type: TableStringEnum.DELETE,
                svg: true,
            }
        );
    }
}
