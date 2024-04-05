import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

// models
import { CardRows, DataResult } from 'src/app/shared/models/card-data.model';
import { CardDetails } from 'src/app/shared/models/card-table-data.model';

// helpers
import { CardHelper } from 'src/app/shared/utils/helpers/card-helper';

// services
import { TruckassistTableService } from 'src/app/shared/services/truckassist-table.service';

@Component({
    selector: 'app-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss'],
    providers: [CardHelper],
})
export class UserCardComponent implements OnChanges {
    @Input() viewData: CardDetails[];

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows[];
    @Input() displayRowsBack: CardRows[];
    @Input() cardTitleLink: string;

    public isCardFlippedCheckInCards: number[] = [];

    public cardsFront: DataResult[][][] = [];
    public cardsBack: DataResult[][][] = [];
    public titleArray: string[][] = [];

    constructor(
        private tableService: TruckassistTableService,
        private cardHelper: CardHelper
    ) {}

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
}
