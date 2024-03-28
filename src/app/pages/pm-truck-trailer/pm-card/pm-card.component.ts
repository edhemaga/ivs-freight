import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// models
import { CardDetails } from '../../shared/model/card-table-data.model';
import { CardRows, DataResult } from '../../shared/model/card-data.model';

// helpers
import { ValueByStringPath } from 'src/app/core/helpers/cards-helper';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Component({
    selector: 'app-pm-card',
    templateUrl: './pm-card.component.html',
    styleUrls: ['./pm-card.component.scss'],
    providers: [ValueByStringPath],
})
export class PmCardComponent implements OnInit, OnChanges {
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
        private valueByStringPath: ValueByStringPath
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

        const cardTitles = this.valueByStringPath.renderCards(
            this.viewData,
            this.cardTitle,
            null
        );

        const frontOfCards = this.valueByStringPath.renderCards(
            this.viewData,
            null,
            this.displayRowsFront
        );

        const backOfCards = this.valueByStringPath.renderCards(
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

        const checkedCard = this.valueByStringPath.onCheckboxSelect(
            index,
            card
        );

        this.tableService.sendRowsSelected(checkedCard);
    }

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards = this.valueByStringPath.flipCard(index);
    }

    public trackCard(item: number): number {
        return item;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
