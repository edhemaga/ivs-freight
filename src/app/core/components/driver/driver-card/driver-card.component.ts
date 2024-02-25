import { Component, Input } from '@angular/core';

// model
import { CardDetails } from '../../shared/model/card-table-data.model';
import { CardRows } from '../../shared/model/cardData';

// helpers
import { ValueByStringPath } from 'src/app/core/helpers/cards-helper';

@Component({
    selector: 'app-driver-card',
    templateUrl: './driver-card.component.html',
    styleUrls: ['./driver-card.component.scss'],
})
export class DriverCardComponent {
    // All data
    @Input() viewData: CardDetails[];
    @Input() selectedTab: string;

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
