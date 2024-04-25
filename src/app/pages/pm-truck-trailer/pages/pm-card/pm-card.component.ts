import {
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// Models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';

// Helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';

// Services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

// Components
import { PmModalComponent } from '@pages/pm-truck-trailer/pages/pm-modal/pm-modal.component';

@Component({
    selector: 'app-pm-card',
    templateUrl: './pm-card.component.html',
    styleUrls: ['./pm-card.component.scss'],
    providers: [CardHelper],
})
export class PmCardComponent implements OnInit, OnDestroy {
    // All data
    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
    }

    // Page
    @Input() selectedTab: string;

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];
    @Input() cardTitleLink: string;

    public cardData: CardDetails;
    public _viewData: CardDetails[];

    public isCardFlippedCheckInCards: number[] = [];

    private destroy$ = new Subject<void>();
    public isAllCardsFlipp: boolean = false;

    public cardsFront: CardDataResult[][][] = [];
    public cardsBack: CardDataResult[][][] = [];
    public titleArray: string[][] = [];
    public valueByStringPathInstance = new CardHelper();


    constructor(
        // Services
        private tableService: TruckassistTableService,
        private modalService: ModalService,

        // Helpers
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

    public onCardActions(event): void {
        switch (event.type) {
            case TableStringEnum.CONFIGURE:
                if (this.selectedTab === TableStringEnum.ACTIVE) {
                    this.modalService.openModal(
                        PmModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            type: TableStringEnum.EDIT,
                            header: TableStringEnum.EDIT_TRUCK_PM_HEADER,
                            action: TableStringEnum.UNIT_PM,
                            id: event.data.truck.id,
                            data: event.data,
                        }
                    );
                } else {
                    this.modalService.openModal(
                        PmModalComponent,
                        { size: TableStringEnum.SMALL },
                        {
                            type: TableStringEnum.EDIT,
                            header: TableStringEnum.EDIT_TRAILER_PM_HEADER,
                            action: TableStringEnum.UNIT_PM,
                            id: event.data.trailer.id,
                            data: event.data,
                        }
                    );
                }

            default: {
                break;
            }
        }
    }

    public trackCard(item: number): number {
        return item;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
