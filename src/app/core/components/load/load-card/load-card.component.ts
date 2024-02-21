import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardDetails, SendDataCard } from '../../shared/model/cardTableData';
import { Router } from '@angular/router';

// enums
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';

// pipes
import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';
import { FormatNumberMiPipe } from 'src/app/core/pipes/formatMiles.pipe';

// models
import { CardRows, LoadTableData } from '../../shared/model/cardData';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';

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
    @Input() tableData: LoadTableData[];

    // Page
    @Input() selectedTab: string;

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows;
    @Input() displayRowsBack: CardRows;
    @Input() activeTab: string;
    @Input() cardTitleLink: string;

    public mySelection: { id: number; tableData: CardDetails }[] = [];

    public isCardFlipped: Array<number> = [];
    public isCheckboxCheckedArray: number[] = [];
    public dropDownActive: number;
    public cardData: CardDetails;

    public isCardFlippedArray: number[] = [];

    constructor(
        private formatCurrencyPipe: formatCurrency,
        private formatNumberMi: FormatNumberMiPipe,
        private tableService: TruckassistTableService,
        private detailsDataService: DetailsDataService,
        private router: Router
    ) {}

    // When checkbox is selected
    public onCheckboxSelect(index: number, card: CardDetails): void {
        this.viewData[index].isSelected = !this.viewData[index].isSelected;
        const indexSelected = this.isCheckboxCheckedArray.indexOf(index);

        if (indexSelected !== -1) {
            this.mySelection = this.mySelection.filter(
                (item) => item.id !== card.id
            );
            this.isCheckboxCheckedArray.splice(indexSelected, 1);
        } else {
            this.mySelection.push({ id: card.id, tableData: card });
            this.isCheckboxCheckedArray.push(index);
        }

        this.tableService.sendRowsSelected(this.mySelection);
    }

    // For closed tab status return true false to style status
    public checkLoadStatus(
        card: CardDetails,
        endpoint: string,
        value: string
    ): boolean {
        return this.getValueByStringPath(card, endpoint) === value;
    }

    public getValueByStringPath(
        obj: CardDetails,
        ObjKey: string,
        format?: string
    ): string {
        if (ObjKey === ConstantStringTableComponentsEnum.NO_ENDPOINT)
            return ConstantStringTableComponentsEnum.NO_ENDPOINT_2;

        const isValueOfKey = !ObjKey.split(
            ConstantStringTableComponentsEnum.DOT_1
        ).reduce((acc, part) => acc && acc[part], obj);

        const isNotZeroValueOfKey =
            ObjKey.split(ConstantStringTableComponentsEnum.DOT_1).reduce(
                (acc, part) => acc && acc[part],
                obj
            ) !== 0;

        switch (format) {
            case ConstantStringTableComponentsEnum.MONEY:
                return this.formatCurrencyPipe.transform(
                    ObjKey.split(
                        ConstantStringTableComponentsEnum.DOT_1
                    ).reduce((acc, part) => acc && acc[part], obj)
                );

            // Transform to miles format
            case ConstantStringTableComponentsEnum.MILES_3:
                return this.formatNumberMi.transform(
                    ObjKey.split(
                        ConstantStringTableComponentsEnum.DOT_1
                    ).reduce((acc, part) => acc && acc[part], obj)
                );

            default:
                if (isValueOfKey && isNotZeroValueOfKey)
                    return ConstantStringTableComponentsEnum.SLASH;

                return ObjKey.split(
                    ConstantStringTableComponentsEnum.DOT_1
                ).reduce((acc, part) => acc && acc[part], obj);
        }
    }

    public onTableBodyActions(action): void {
        this.bodyActions.emit(action);
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
