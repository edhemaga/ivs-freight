import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

// models
import { CardDetails, SendDataCard } from '../../shared/model/cardTableData';
import { CardRows } from '../../shared/model/cardData';

// enums
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';

// pipes
import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';
import { TimeFormatPipe } from 'src/app/core/pipes/time-format-am-pm.pipe';

// services
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';

@Component({
    selector: 'app-customer-card',
    templateUrl: './customer-card.component.html',
    styleUrls: ['./customer-card.component.scss'],
    providers: [formatCurrency, TimeFormatPipe],
})
export class CustomerCardComponent implements OnInit {
    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();

    @Input() viewData: CardDetails[];

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows;
    @Input() displayRowsBack: CardRows;
    @Input() activeTab: string;
    @Input() cardTitleLink: string;

    public isCardFlipped: Array<number> = [];

    // Array holding id of checked cards
    public isCheckboxCheckedArray: number[] = [];

    public isCardFlippedArray: number[] = [];

    public mySelection: { id: number; tableData: CardDetails }[] = [];

    constructor(
        private formatCurrencyPipe: formatCurrency,
        private timeFormatPipe: TimeFormatPipe,
        private tableService: TruckassistTableService,
        private detailsDataService: DetailsDataService,
        private router: Router
    ) {}

    ngOnInit(): void {}

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

    //Remove quotes from string to convert into endpoint
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

            // Transform 24h time to am-pm
            case ConstantStringTableComponentsEnum.AM_PM:
                return this.timeFormatPipe.transform(
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
