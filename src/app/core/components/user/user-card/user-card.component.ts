import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

// models
import { CardDetails } from '../../shared/model/card-table-data.model';
import { CardRows, DataResult } from '../../shared/model/card-data.model';

// helpers
import { ValueByStringPath } from 'src/app/core/helpers/cards-helper';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Component({
    selector: 'app-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss'],
    providers: [ValueByStringPath],
})
export class UserCardComponent implements OnChanges {
    // All data
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
        private valueByStringPath: ValueByStringPath
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
}
