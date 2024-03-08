import { Component, Input, OnInit } from '@angular/core';
import { FormControl, UntypedFormArray } from '@angular/forms';

// models
import { CardDetails } from '../../shared/model/card-table-data.model';
import { CardRows } from '../../shared/model/card-data.model';

// helpers
import { ValueByStringPath } from 'src/app/core/helpers/cards-helper';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { tableBodyColorLabel } from '../../shared/model/tableBody';
import { CompanyAccountLabelResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-account-card',
    templateUrl: './account-card.component.html',
    styleUrls: ['./account-card.component.scss'],
})
export class AccountCardComponent implements OnInit {
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

    public cardData: CardDetails;

    public dropdownSelectionArray = new UntypedFormArray([]);
    public selectedContactLabel: CompanyAccountLabelResponse[] = [];

    constructor(private tableService: TruckassistTableService) {}

    ngOnInit(): void {
        this.viewData.length && this.labelDropdown();
    }

    // When checkbox is selected
    public onCheckboxSelect(index: number, card: CardDetails): void {
        this.viewData[index].isSelected = !this.viewData[index].isSelected;

        const checkedCard = this.valueByStringPathInstance.onCheckboxSelect(
            index,
            card
        );

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
