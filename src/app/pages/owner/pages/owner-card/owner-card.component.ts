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
import { CardDetails } from 'src/app/shared/models/card-table-data.model';
import {
    CardRows,
    DataResult,
} from 'src/app/core/components/shared/model/card-data.model';
import { OwnerBodyResponse } from '../../models/owner.model';

// helpers
import { CardHelper } from 'src/app/shared/utils/helpers/card-helper';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';

// enum
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enum';

// component
import { ConfirmationModalComponent } from 'src/app/core/components/modals/confirmation-modal/confirmation-modal.component';
import { OwnerModalComponent } from 'src/app/core/components/modals/owner-modal/owner-modal.component';
import { TruckModalComponent } from 'src/app/pages/truck/pages/truck-modal/truck-modal.component';
import { TrailerModalComponent } from 'src/app/pages/trailer/pages/trailer-modal/trailer-modal.component';

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

    public cardsFront: DataResult[][][] = [];
    public cardsBack: DataResult[][][] = [];
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

    public onCardActions(event: OwnerBodyResponse): void {
        if (event.type === ConstantStringTableComponentsEnum.ACTIVATE_ITEM) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...event,
                    template: ConstantStringTableComponentsEnum.OWNER_3,
                    type: event.data.isSelected
                        ? ConstantStringTableComponentsEnum.DEACTIVATE
                        : ConstantStringTableComponentsEnum.ACTIVATE,
                    svg: true,
                }
            );
        } else if (event.type === ConstantStringTableComponentsEnum.EDIT) {
            this.modalService.openModal(
                OwnerModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...event,
                    type: ConstantStringTableComponentsEnum.EDIT,
                    selectedTab: this.selectedTab,
                }
            );
        } else if (
            event.type === ConstantStringTableComponentsEnum.DELETE_ITEM
        ) {
            this.modalService.openModal(
                ConfirmationModalComponent,
                { size: ConstantStringTableComponentsEnum.SMALL },
                {
                    ...event,
                    template: ConstantStringTableComponentsEnum.OWNER_3,
                    type: ConstantStringTableComponentsEnum.DELETE,
                    svg: true,
                }
            );
        } else if (event.type === ConstantStringTableComponentsEnum.ADD_TRUCK) {
            this.modalService.setProjectionModal({
                action: ConstantStringTableComponentsEnum.OPEN,
                payload: {
                    key: null,
                    value: null,
                },
                component: TruckModalComponent,
                size: ConstantStringTableComponentsEnum.SMALL,
                closing: ConstantStringTableComponentsEnum.FASTEST,
            });
        } else if (
            event.type === ConstantStringTableComponentsEnum.ADD_TRAILER
        ) {
            this.modalService.setProjectionModal({
                action: ConstantStringTableComponentsEnum.OPEN,
                payload: {
                    key: null,
                    value: null,
                },
                component: TrailerModalComponent,
                size: ConstantStringTableComponentsEnum.SMALL,
                closing: ConstantStringTableComponentsEnum.FASTEST,
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
