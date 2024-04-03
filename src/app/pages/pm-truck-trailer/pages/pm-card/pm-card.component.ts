import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// Models
import { CardDetails } from 'src/app/shared/models/card-table-data.model';
import {
    CardRows,
    DataResult,
} from 'src/app/core/components/shared/model/card-data.model';

// Helpers
import { CardHelper } from 'src/app/shared/utils/helpers/card-helper';

// Services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Component({
    selector: 'app-pm-card',
    templateUrl: './pm-card.component.html',
    styleUrls: ['./pm-card.component.scss'],
    providers: [CardHelper],
})
export class PmCardComponent implements OnInit, OnChanges, OnDestroy {
    // All data
    @Input() viewData: CardDetails[];

    // Page
    @Input() selectedTab: string;

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];
    @Input() cardTitleLink: string;

    public cardData: CardDetails;

    public isCardFlippedCheckInCards: number[] = [];

    private destroy$ = new Subject<void>();
    public isAllCardsFlipp: boolean = false;

    public cardsFront: DataResult[][][] = [];
    public cardsBack: DataResult[][][] = [];
    public titleArray: string[][] = [];

    constructor(
        private tableService: TruckassistTableService,
        private cardHelper: CardHelper
    ) {}

    ngOnInit() {
        this.flipAllCards();
    }

    ngOnChanges(cardChanges: SimpleChanges) {
        if (
            cardChanges.displayRowsBack.currentValue ||
            cardChanges.displayRowsFront.currentValue
        )
            this.getTransformedCardsData();
    }

    public getTransformedCardsData(): void {
        this.cardsFront = [];
        this.cardsBack = [];
        this.titleArray = [];

        const cardTitles = this.cardHelper.renderCards(
            this.viewData,
            this.cardTitle,
            null
        );

        const frontOfCards = this.cardHelper.renderCards(
            this.viewData,
            null,
            this.displayRowsFront
        );

        const backOfCards = this.cardHelper.renderCards(
            this.viewData,
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
        this.viewData[index].isSelected = !this.viewData[index].isSelected;

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

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
