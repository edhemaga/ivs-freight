import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// models
import { OwnerData } from '@pages/owner/models/owner-data.model';
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { CardRows } from '@shared/models/card-models/card-rows.model';
import { CardDataResult } from '@shared/models/card-models/card-data-result.model';

// helpers
import { CardHelper } from '@shared/utils/helpers/card-helper';

// services
import { TruckassistTableService } from '@shared/services/truckassist-table.service';
import { ModalService } from '@shared/services/modal.service';

// enum
import { TableStringEnum } from '@shared/enums/table-string.enum';

// component
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { OwnerModalComponent } from '@pages/owner/pages/owner-modal/owner-modal.component';
import { TruckModalComponent } from '@pages/truck/pages/truck-modal/truck-modal.component';
import { TrailerModalComponent } from '@pages/trailer/pages/trailer-modal/trailer-modal.component';

@Component({
    selector: 'app-owner-card',
    templateUrl: './owner-card.component.html',
    styleUrls: ['./owner-card.component.scss'],
    providers: [CardHelper],
})
export class OwnerCardComponent implements OnInit, OnChanges, OnDestroy {
    @Output() saveValueNote: EventEmitter<{ value: string; id: number }> =
        new EventEmitter<{ value: string; id: number }>();

    // All data
    @Input() set viewData(value: CardDetails[]) {
        this._viewData = value;
        this.getTransformedCardsData();
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

    constructor(
        private tableService: TruckassistTableService,
        private cardHelper: CardHelper,
        private modalService: ModalService
    ) {}

    ngOnInit() {
        this.flipAllCards();
    }

    ngOnChanges(cardChanges: SimpleChanges) {
        if (
            cardChanges?.displayRowsBack?.currentValue ||
            cardChanges?.displayRowsFront?.currentValue
        )
            this.getTransformedCardsData();
    }

    public getTransformedCardsData(): void {
        this.cardsFront = [];
        this.cardsBack = [];
        this.titleArray = [];

        const cardTitles = this.cardHelper.renderCards(
            this._viewData,
            this.cardTitle,
            null
        );

        const frontOfCards = this.cardHelper.renderCards(
            this._viewData,
            null,
            this.displayRowsFront
        );

        const backOfCards = this.cardHelper.renderCards(
            this._viewData,
            null,
            this.displayRowsBack
        );

        this.cardsFront = [...this.cardsFront, frontOfCards.dataForRows];

        this.cardsBack = [...this.cardsBack, backOfCards.dataForRows];

        this.titleArray = [...this.titleArray, cardTitles.cardsTitle];
    }

    public flipAllCards(): void {
        this.tableService.isFlipedAllCards
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.isAllCardsFlipp = res;
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

    public trackCard(item: number): number {
        return item;
    }

    public onCardActions(event: OwnerData): void {
        if (event.type === TableStringEnum.ACTIVATE_ITEM) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    template: TableStringEnum.OWNER_3,
                    type: event.data.isSelected
                        ? TableStringEnum.DEACTIVATE
                        : TableStringEnum.ACTIVATE,
                    svg: true,
                }
            );
        } else if (event.type === TableStringEnum.EDIT) {
            this.modalService.openModal(
                OwnerModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    type: TableStringEnum.EDIT,
                    selectedTab: this.selectedTab,
                }
            );
        } else if (event.type === TableStringEnum.DELETE_ITEM) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...event,
                    template: TableStringEnum.OWNER_3,
                    type: TableStringEnum.DELETE,
                    svg: true,
                }
            );
        } else if (event.type === TableStringEnum.ADD_TRUCK) {
            this.modalService.setProjectionModal({
                action: TableStringEnum.OPEN,
                payload: {
                    key: null,
                    value: null,
                },
                component: TruckModalComponent,
                size: TableStringEnum.SMALL,
                closing: TableStringEnum.FASTEST,
            });
        } else if (event.type === TableStringEnum.ADD_TRAILER) {
            this.modalService.setProjectionModal({
                action: TableStringEnum.OPEN,
                payload: {
                    key: null,
                    value: null,
                },
                component: TrailerModalComponent,
                size: TableStringEnum.SMALL,
                closing: TableStringEnum.FASTEST,
            });
        }
    }

    public saveNoteValue(note: string, id: number): void {
        this.saveValueNote.emit({
            value: note,
            id: id,
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
