import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    CardDetails,
    SendDataCard,
} from '../../shared/model/card-table-data.model';
import { Router } from '@angular/router';

// pipes
import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';
import { FormatNumberMiPipe } from 'src/app/core/pipes/formatMiles.pipe';

// models
import { CardRows, LoadTableData } from '../../shared/model/cardData';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';

// helpers
import { ValueByStringPath } from 'src/app/core/helpers/cards-helper';

@Component({
    selector: 'app-load-card',
    templateUrl: './load-card.component.html',
    styleUrls: ['./load-card.component.scss'],
    providers: [FormatNumberMiPipe, formatCurrency],
})
export class LoadCardComponent {
    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();

    // All data
    @Input() viewData: CardDetails[];

    // Page
    @Input() selectedTab: string;

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows;
    @Input() displayRowsBack: CardRows;
    @Input() cardTitleLink: string;

    public valueByStringPathInstance = new ValueByStringPath();

    public isCardFlipped: Array<number> = [];
    public dropDownActive: number;
    public cardData: CardDetails;

    public isCardFlippedArray: number[] = [];

    constructor(
        private tableService: TruckassistTableService,
        private detailsDataService: DetailsDataService,
        private router: Router
    ) {}

    // When checkbox is selected
    public onCheckboxSelect(index: number, card: CardDetails): void {
        this.viewData[index].isSelected = !this.viewData[index].isSelected;

        const checkedCard = this.valueByStringPathInstance.onCheckboxSelect(
            index,
            card
        );

        this.tableService.sendRowsSelected(checkedCard);
    }

    // For closed tab status return true false to style status
    public checkLoadStatus(
        card: CardDetails,
        endpoint: string,
        value: string
    ): boolean {
        return (
            this.valueByStringPathInstance.getValueByStringPath(
                card,
                endpoint
            ) === value
        );
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

    public goToDetailsPage(card: CardDetails, link: string): void {
        this.detailsDataService.setNewData(card);

        this.router.navigate([link]);
    }

    public trackCard(item: number): number {
        return item;
    }
}
