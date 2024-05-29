import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

//Modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

//Components
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';

//Pipes
import { FormatPhonePipe } from '@shared/pipes/format-phone.pipe';
import { DepartmentContacts } from '@shared/models/department-contacts.model';

//Services
import { DropDownService } from '@shared/services/drop-down.service';
import { ModalService } from '@shared/services/modal.service';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalComponent } from '../ta-shared-modals/confirmation-modal/confirmation-modal.component';

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

        //Components
        TaCustomCardComponent,
        TaCopyComponent,

        //Pipes
        FormatPhonePipe,
    ],
})
export class TaContactsCardComponent implements OnDestroy {
    @Input() public departmentContacts: DepartmentContacts[];
    @Input() public parentId: number;
    private destroy$ = new Subject<void>();

    constructor(private dropDownService: DropDownService, private modalService: ModalService) {}

    public identity(index: number, item: DepartmentContacts): number {
        return item.id;
    }

    public editContact(): void {
        const eventObject = {
            data: null,
            id: this.parentId,
            type: TableStringEnum.EDIT,
            openedTab: TableStringEnum.CONTACT_2,
        };
        setTimeout(() => {
            this.dropDownService.dropActionsHeaderShipperBroker(
                eventObject,
                null,
                TableStringEnum.SHIPPER
            );
        }, 100);
    }

    public deleteContactModal(): void {
        this.modalService.openModal(
            ConfirmationModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...event,
                template: TableStringEnum.CONTACT,
                type: TableStringEnum.DELETE,
                svg: true,
            }
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
