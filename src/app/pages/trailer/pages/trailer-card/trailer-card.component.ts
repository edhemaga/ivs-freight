import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// base classes
import { TrailerDropdownMenuActionsBase } from '@pages/trailer/base-classes';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';
import { DropdownMenuActionsHelper } from '@shared/utils/helpers/dropdown-menu-helpers';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';
import { DetailsDataService } from '@shared/services/details-data.service';

//enums
import { DropdownMenuStringEnum } from '@shared/enums';

// models
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';
import { TrailerMapped } from '../trailer-table/models/trailer-mapped.model';
import { DropdownMenuOptionEmit } from '@ca-shared/components/ca-dropdown-menu/models';

//Svg Routes
import { TrailerCardsSvgRoutes } from '@pages/trailer/pages/trailer-card/utils/svg-routes/trailer-cards-svg-routes';

@Component({
    selector: 'app-trailer-card',
    templateUrl: './trailer-card.component.html',
    styleUrls: ['./trailer-card.component.scss'],
    providers: [CardHelper],
})
export class TrailerCardComponent
    extends TrailerDropdownMenuActionsBase
    implements OnInit, OnDestroy
{
    @Output() saveValueNote: EventEmitter<{ value: string; id: number }> =
        new EventEmitter<{ value: string; id: number }>();

    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }
    @Input() cardTitle: string;
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];

    private destroy$ = new Subject<void>();
    public isAllCardsFlipp: boolean = false;

    public isCardFlippedCheckInCards: number[] = [];
    public _viewData: CardDetails[];
    public cardsFront: CardDataResult[][][] = [];
    public cardsBack: CardDataResult[][][] = [];
    public titleArray: string[][] = [];

    public trailerImageRoutes = TrailerCardsSvgRoutes;

    constructor(
        protected router: Router,
        //Services
        private tableService: TruckassistTableService,
        protected modalService: ModalService,
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

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards = this.cardHelper.flipCard(index);
    }

    // When checkbox is selected
    public onCheckboxSelect(index: number, card: CardDetails): void {
        this._viewData[index].isSelected = !this._viewData[index].isSelected;

        const checkedCard = this.cardHelper.onCheckboxSelect(index, card);

        this.tableService.sendRowsSelected(checkedCard);
    }

    public trackCard(id: number): number {
        return id;
    }

    // public onCardActions(event: TrailerBodyResponse): void {
    //     const mappedEvent = {
    //         ...event,
    //         data: {
    //             ...event.data,
    //             number: event.data?.trailerNumber,
    //             avatar: `assets/svg/common/trailers/${event.data?.trailerType?.logoName}`,
    //         },
    //     };

    //     switch (event.type) {
    //         case TableStringEnum.EDIT_TRAILER: {
    //             this.modalService.openModal(
    //                 TrailerModalComponent,
    //                 { size: TableStringEnum.SMALL },
    //                 {
    //                     ...event,
    //                     type: TableStringEnum.ADD,
    //                     disableButton: true,
    //                     tabSelected: this.selectedTab,
    //                 }
    //             );
    //             break;
    //         }
    //         case TableStringEnum.VIEW_DETAILS: {
    //             this.router.navigate([`/list/trailer/${event.id}/details`]);
    //             break;
    //         }
    //         case TableStringEnum.ADD_REGISTRATION: {
    //             this.modalService.openModal(
    //                 TtRegistrationModalComponent,
    //                 { size: TableStringEnum.SMALL },
    //                 {
    //                     ...event,
    //                     modal: TableStringEnum.TRAILER_2,
    //                     tabSelected: this.selectedTab,
    //                 }
    //             );
    //             break;
    //         }
    //         case TableStringEnum.ADD_INSPECTION: {
    //             this.modalService.openModal(
    //                 TtFhwaInspectionModalComponent,
    //                 { size: TableStringEnum.SMALL },
    //                 {
    //                     ...event,
    //                     modal: TableStringEnum.TRAILER_2,
    //                     tabSelected: this.selectedTab,
    //                 }
    //             );
    //             break;
    //         }
    //         case TableStringEnum.ADD_TITLE: {
    //             this.modalService.openModal(
    //                 TtTitleModalComponent,
    //                 { size: TableStringEnum.SMALL },
    //                 {
    //                     ...event,
    //                     modal: TableStringEnum.TRAILER_2,
    //                     tabSelected: this.selectedTab,
    //                 }
    //             );
    //             break;
    //         }
    //         case TableStringEnum.ACTIVATE_ITEM: {
    //             this.modalService.openModal(
    //                 ConfirmationActivationModalComponent,
    //                 { size: TableStringEnum.SMALL },
    //                 {
    //                     ...mappedEvent,
    //                     template: TableStringEnum.TRAILER_2,
    //                     subType: TableStringEnum.TRAILER_2,
    //                     type:
    //                         event.data.status === 1
    //                             ? TableStringEnum.DEACTIVATE
    //                             : TableStringEnum.ACTIVATE,
    //                     tableType: TableStringEnum.TRAILER_2,
    //                     modalTitle: ' Unit ' + mappedEvent?.data?.number,
    //                     modalSecondTitle: mappedEvent?.data?.vin,
    //                     svg: true,
    //                 }
    //             );
    //             break;
    //         }
    //         case TableStringEnum.DELETE_ITEM: {
    //             this.modalService.openModal(
    //                 ConfirmationModalComponent,
    //                 { size: TableStringEnum.SMALL },
    //                 {
    //                     ...mappedEvent,
    //                     template: TableStringEnum.TRAILER_2,
    //                     type: TableStringEnum.DELETE,
    //                     svg: true,
    //                 }
    //             );
    //             break;
    //         }
    //         default: {
    //             break;
    //         }
    //     }
    // }

    public saveNoteValue(note: string, id: number): void {
        this.saveValueNote.emit({
            value: note,
            id: id,
        });
    }

    public handleToggleDropdownMenuActions<T extends TrailerMapped>(
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
            DropdownMenuStringEnum.TRAILER
        );
    }

    public goToDetailsPage(card: CardDetails, link: string): void {
        this.detailsDataService.setNewData(card);

        this.router.navigate([link]);
    }

    public handleShowMoreAction(): void {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
