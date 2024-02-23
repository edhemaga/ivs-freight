import { Component, Input } from '@angular/core';

// models
import { CardDetails } from '../../shared/model/card-table-data.model';
import { CardRows } from '../../shared/model/cardData';

// helpers
import { ValueByStringPath } from 'src/app/core/helpers/cards-helper';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Component({
    selector: 'app-contacts-card',
    templateUrl: './contacts-card.component.html',
    styleUrls: ['./contacts-card.component.scss'],
})
export class ContactsCardComponent {
    // All data
    @Input() viewData: CardDetails[];

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows;
    @Input() displayRowsBack: CardRows;
    @Input() cardTitleLink: string;

    public valueByStringPathInstance = new ValueByStringPath();

    public isCardFlippedArray: number[] = [];
    public isCardFlipped: Array<number> = [];

    constructor(private tableService: TruckassistTableService) {}

    // When checkbox is selected
    public onCheckboxSelect(index: number, card: CardDetails): void {
        this.viewData[index].isSelected = !this.viewData[index].isSelected;

        const checkedCard = this.valueByStringPathInstance.onCheckboxSelect(
            index,
            card
        );

        this.tableService.sendRowsSelected(checkedCard);
    }

    // Flip card based on card index
    public flipCard(index: number): void {
        const indexSelected = this.isCardFlippedArray.indexOf(index);

        if (indexSelected !== -1) {
            this.isCardFlippedArray.splice(indexSelected, 1);
            this.isCardFlipped = this.isCardFlippedArray;
        } else {
            this.isCardFlippedArray.push(index);
            this.isCardFlipped = this.isCardFlippedArray;
        }

        return;
    }

    public trackCard(item: number): number {
        return item;
    }
}
