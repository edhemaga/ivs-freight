import {
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';

import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';

// models
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';
import { TrailerBodyResponse } from '@pages/trailer/pages/trailer-table/models/trailer-body-response.model';

//Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

//Components
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';
import { TtTitleModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-title-modal/tt-title-modal.component';
import { TtFhwaInspectionModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-fhwa-inspection-modal/tt-fhwa-inspection-modal.component';
import { TtRegistrationModalComponent } from '@shared/components/ta-shared-modals/truck-trailer-modals/modals/tt-registration-modal/tt-registration-modal.component';
import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';

//Svg Routes
import { TrailerCardsSvgRoutes } from '@pages/trailer/pages/trailer-card/utils/svg-routes/trailer-cards-svg-routes';

@Component({
    selector: 'app-trailer-card',
    templateUrl: './trailer-card.component.html',
    styleUrls: ['./trailer-card.component.scss'],
    providers: [CardHelper],
})
export class TrailerCardComponent implements OnInit, OnDestroy {
    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }
    @Input() selectedTab: string;
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
        private router: Router,
        //Services
        private tableService: TruckassistTableService,
        private modalService: ModalService,

        //Helpers
        private cardHelper: CardHelper
    ) {}

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

    public onCardActions(event: TrailerBodyResponse): void {
        const mappedEvent = {
            ...event,
            data: {
                ...event.data,
                number: event.data?.trailerNumber,
                avatar: `assets/svg/common/trailers/${event.data?.trailerType?.logoName}`,
            },
        };

        switch (event.type) {
            case TableStringEnum.EDIT_TRAILER: {
                this.modalService.openModal(
                    TrailerModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        type: TableStringEnum.ADD,
                        disableButton: true,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case TableStringEnum.VIEW_DETAILS: {
                this.router.navigate([`/list/trailer/${event.id}/details`]);
                break;
            }
            case TableStringEnum.ADD_REGISTRATION: {
                this.modalService.openModal(
                    TtRegistrationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        modal: TableStringEnum.TRAILER_2,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case TableStringEnum.ADD_INSPECTION: {
                this.modalService.openModal(
                    TtFhwaInspectionModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        modal: TableStringEnum.TRAILER_2,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case TableStringEnum.ADD_TITLE: {
                this.modalService.openModal(
                    TtTitleModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...event,
                        modal: TableStringEnum.TRAILER_2,
                        tabSelected: this.selectedTab,
                    }
                );
                break;
            }
            case TableStringEnum.ACTIVATE_ITEM: {
                this.modalService.openModal(
                    ConfirmationActivationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: TableStringEnum.TRAILER_2,
                        subType: TableStringEnum.TRAILER_2,
                        type:
                            event.data.status === 1
                                ? TableStringEnum.DEACTIVATE
                                : TableStringEnum.ACTIVATE,
                        tableType: TableStringEnum.TRAILER_2,
                        modalTitle: ' Unit ' + mappedEvent?.data?.number,
                        modalSecondTitle: mappedEvent?.data?.vin,
                        svg: true,
                    }
                );
                break;
            }
            case TableStringEnum.DELETE_ITEM: {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: TableStringEnum.TRAILER_2,
                        type: TableStringEnum.DELETE,
                        svg: true,
                    }
                );
                break;
            }
            default: {
                break;
            }
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
