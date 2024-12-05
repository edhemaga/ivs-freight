import { Component, Input, ViewEncapsulation } from '@angular/core';

//Modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

//Components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { RepairShopModalComponent } from '@pages/repair/pages/repair-modals/repair-shop-modal/repair-shop-modal.component';

//Pipes
import { FormatPhonePipe } from '@shared/pipes/format-phone.pipe';
import { HighlightSearchPipe } from '@shared/pipes';

//Models
import { DepartmentContacts } from '@shared/models/department-contacts.model';
import {
    BrokerResponse,
    RepairShopResponse,
    ShipperResponse,
} from 'appcoretruckassist';

//Services
import { DropDownService } from '@shared/services/drop-down.service';
import { ModalService } from '@shared/services/modal.service';
import { DetailsDataService } from '@shared/services/details-data.service';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

//Constants
import { ContactsCardSvgRoutes } from '@shared/components/ta-contacts-card/utils/svg-routes/contacts-card-svg-routes';

//Modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-ta-contacts-card',
    templateUrl: './ta-contacts-card.component.html',
    styleUrls: ['./ta-contacts-card.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        TaCustomCardComponent,
        TaCopyComponent,
        TaAppTooltipV2Component,

        // pipes
        FormatPhonePipe,
        HighlightSearchPipe,
    ],
})
export class TaContactsCardComponent {
    @Input() public type?: string;
    @Input() public searchValue?: string;
    @Input() public departmentContacts: DepartmentContacts[];
    @Input() public viewData?:
        | BrokerResponse
        | ShipperResponse
        | RepairShopResponse;

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
        if (this.type === TableStringEnum.REPAIR_SHOP_3) {
            const mappedEvent = {
                id: this.viewData.id,
                type: TableStringEnum.EDIT,
                openedTab: TableStringEnum.CONTACT,
            };

            this.modalService.openModal(
                RepairShopModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                }
            );
        } else {
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
    }

    public deleteContactModal(contactData): void {
        this.DetailsDataService.setContactName(contactData.fullName);

        const mappedEvent = {
            id: contactData.id,
            data: {
                ...contactData,
                businessName:
                    (this.viewData as BrokerResponse).businessName ||
                    (this.viewData as RepairShopResponse).name,
            },
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
                        : this.type === TableStringEnum.REPAIR_SHOP_3
                        ? TableStringEnum.REPAIR_SHOP_CONTACT
                        : TableStringEnum.SHIPPER_CONTACT,
                type: TableStringEnum.DELETE,
                svg: true,
            }
        );
    }
}
