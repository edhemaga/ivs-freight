import { Component, Input } from '@angular/core';

// models
import { CardRows } from '../../shared/model/cardData';
import { CardDetails } from '../../shared/model/card-table-data.model';

// helpers
import { ValueByStringPath } from 'src/app/core/helpers/cards-helper';

@Component({
    selector: 'app-trailer-card',
    templateUrl: './trailer-card.component.html',
    styleUrls: ['./trailer-card.component.scss'],
})
export class TrailerCardComponent {
    @Input() viewData: CardDetails[];

    @Input() cardTitle: string;
    @Input() displayRowsFront: CardRows;
    @Input() displayRowsBack: CardRows;

    public valueByStringPathInstance = new ValueByStringPath();

    public isCardFlippedCheckInCards: number[] = [];

    // Flip card based on card index
    public flipCard(index: number): void {
        this.isCardFlippedCheckInCards =
            this.valueByStringPathInstance.flipCard(index);
    }

    public trackCard(id: number): number {
        return id;
    }
}
