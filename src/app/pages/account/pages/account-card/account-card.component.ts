import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { FormControl, UntypedFormArray } from '@angular/forms';

// models
import { CardDetails } from 'src/app/shared/models/card-table-data.model';
import {
    CardRows,
    DataResult,
} from 'src/app/core/components/shared/model/card-data.model';
import { CompanyAccountLabelResponse } from 'appcoretruckassist';
import { tableBodyColorLabel } from 'src/app/core/components/shared/model/tableBody';

// helpers
import { CardHelper } from 'src/app/shared/utils/helpers/card-helper';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Component({
    selector: 'app-account-card',
    templateUrl: './account-card.component.html',
    styleUrls: ['./account-card.component.scss'],
    providers: [CardHelper],
})
export class AccountCardComponent implements OnInit, OnChanges {
    @Input() viewData: CardDetails[];
    @Input() selectedTab: string;

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows[];
    @Input() cardTitleLink: string;

    public cardData: CardDetails;

    public dropdownSelectionArray = new UntypedFormArray([]);
    public selectedContactLabel: CompanyAccountLabelResponse[] = [];

    public cardsFront: DataResult[][][] = [];
    public cardsBack: DataResult[][][] = [];
    public titleArray: string[][] = [];

    constructor(
        private tableService: TruckassistTableService,
        private cardHelper: CardHelper
    ) {}

    ngOnInit(): void {
        this.viewData.length && this.labelDropdown();
    }

    ngOnChanges(cardChanges: SimpleChanges) {
        if (cardChanges?.displayRowsFront?.currentValue)
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

        this.cardsFront = [...this.cardsFront, frontOfCards.dataForRows];

        this.titleArray = [...this.titleArray, cardTitles.cardsTitle];
    }

    // When checkbox is selected
    public onCheckboxSelect(index: number, card: CardDetails): void {
        this.viewData[index].isSelected = !this.viewData[index].isSelected;

        const checkedCard = this.cardHelper.onCheckboxSelect(index, card);

        this.tableService.sendRowsSelected(checkedCard);
    }

    public labelDropdown(): tableBodyColorLabel {
        for (let card of this.viewData) {
            this.dropdownSelectionArray.push(new FormControl());
            if (card.companyContactLabel) {
                return card.companyContactLabel;
            } else if (card.companyAccountLabel) {
                this.selectedContactLabel.push(card.companyAccountLabel);
            }
        }
    }

    public trackCard(item: number): number {
        return item;
    }
}
