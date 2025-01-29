import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// base classes
import { DriverDropdownMenuActionsBase } from '@pages/driver/base-classes/driver-dropdown-menu-actions.base';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';
import { DriverService } from '@pages/driver/services/driver.service';

// enums
import { DropdownMenuStringEnum } from '@shared/enums';

// model
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';
import { DropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/models';

// svg-routes
import { DriverCardSvgRoutes } from '@pages/driver/pages/driver-card/utils/svg-routes/driver-card-svg-routes';
import { DetailsDataService } from '@shared/services/details-data.service';

@Component({
    selector: 'app-driver-card',
    templateUrl: './driver-card.component.html',
    styleUrls: ['./driver-card.component.scss'],
    providers: [CardHelper],
})
export class DriverCardComponent
    extends DriverDropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }

    // card body endpoints
    @Input() cardTitle: string;
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];

    protected destroy$ = new Subject<void>();

    public _viewData: CardDetails[];

    public isCardFlippedCheckInCards: number[] = [];
    public isAllCardsFlipp: boolean = false;

    public cardsFront: CardDataResult[][][] = [];
    public cardsBack: CardDataResult[][][] = [];
    public titleArray: string[][] = [];

    public driverImageRoutes = DriverCardSvgRoutes;

    constructor(
        protected router: Router,

        //Services
        protected modalService: ModalService,
        private tableService: TruckassistTableService,
        protected driverService: DriverService,
        private detailsDataService: DetailsDataService,

        //Helpers
        private cardHelper: CardHelper
    ) {
        super();
    }

    ngOnInit() {
        this.flipAllCards();
    }

    public flipAllCards(): void {
        this.tableService.isFlipedAllCards
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.isAllCardsFlipp = res;

                this.isCardFlippedCheckInCards = [];
                this.cardHelper.isCardFlippedArrayComparasion = [];
            });
    }

    // When checkbox is selected
    public onCheckboxSelect(index: number, card: CardDetails): void {
        this._viewData[index].isSelected = !this._viewData[index].isSelected;

        const checkedCard = this.cardHelper.onCheckboxSelect(index, card);

        this.tableService.sendRowsSelected(checkedCard);
    }

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards = this.cardHelper.flipCard(index);
    }

    public trackCard(id: number): number {
        return id;
    }

    // public onCardActions(event: any): void {
    //     const mappedEvent = {
    //         ...event,
    //         data: {
    //             ...event.data,
    //             name: event.data?.fullName,
    //         },
    //     };
    //     if (event.type === TableStringEnum.EDIT) {
    //         if (this.selectedTab === TableStringEnum.APPLICANTS) {
    //             this.modalService.openModal(
    //                 ApplicantModalComponent,
    //                 {
    //                     size: TableStringEnum.SMALL,
    //                 },
    //                 {
    //                     id: 1,
    //                     type: TableStringEnum.EDIT,
    //                 }
    //             );
    //         } else {
    //             this.getDriverById(event.id);
    //         }
    //     } else if (event.type === TableStringEnum.NEW_LICENCE) {
    //         this.modalService.openModal(
    //             DriverCdlModalComponent,
    //             { size: TableStringEnum.SMALL },
    //             { ...event, tableActiveTab: this.selectedTab }
    //         );
    //     } else if (event.type === TableStringEnum.VIEW_DETAILS) {
    //         this.router.navigate([`/list/driver/${event.id}/details`]);
    //     } else if (event.type === TableStringEnum.NEW_MEDICAL) {
    //         this.modalService.openModal(
    //             DriverMedicalModalComponent,
    //             {
    //                 size: TableStringEnum.SMALL,
    //             },
    //             { ...event, tableActiveTab: this.selectedTab }
    //         );
    //     } else if (event.type === TableStringEnum.NEW_MVR) {
    //         this.modalService.openModal(
    //             DriverMvrModalComponent,
    //             { size: TableStringEnum.SMALL },
    //             { ...event, tableActiveTab: this.selectedTab }
    //         );
    //     } else if (event.type === TableStringEnum.NEW_DRUG) {
    //         this.modalService.openModal(
    //             DriverDrugAlcoholTestModalComponent,
    //             {
    //                 size: TableStringEnum.SMALL,
    //             },
    //             { ...event, tableActiveTab: this.selectedTab }
    //         );
    //     } else if (event.type === TableStringEnum.ACTIVATE_ITEM) {
    //         this.modalService.openModal(
    //             ConfirmationActivationModalComponent,
    //             { size: TableStringEnum.SMALL },
    //             {
    //                 ...mappedEvent,
    //                 subType: TableStringEnum.DRIVER_1,
    //                 type:
    //                     event.data.status === 1
    //                         ? TableStringEnum.DEACTIVATE
    //                         : TableStringEnum.ACTIVATE,
    //                 template: TableStringEnum.DRIVER_1,
    //                 tableType: TableStringEnum.DRIVER,
    //             }
    //         );
    //     } else if (event.type === TableStringEnum.DELETE_ITEM) {
    //         this.modalService.openModal(
    //             ConfirmationModalComponent,
    //             { size: TableStringEnum.SMALL },
    //             {
    //                 ...mappedEvent,
    //                 template: TableStringEnum.DRIVER,
    //                 type: TableStringEnum.DELETE,
    //                 image: true,
    //             }
    //         );
    //     }
    // }

    public goToDetailsPage(card: CardDetails, link: string): void {
        this.detailsDataService.setNewData(card);

        this.router.navigate([link]);
    }

    public handleToggleDropdownMenuActions<T>(
        event: DropdownMenuOptionEmit,
        cardData: T
    ): void {
        const { type } = event;

        const emitEvent =
            DropdownMenuActionsHelper.createDropdownMenuActionsEmitEvent(
                type,
                cardData
            );

        this.handleDropdownMenuActions(
            emitEvent,
            DropdownMenuStringEnum.DRIVER
        );
    }

    public handleShowMoreAction(): void {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
