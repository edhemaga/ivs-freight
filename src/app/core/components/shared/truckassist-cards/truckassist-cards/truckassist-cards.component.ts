import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { LoadDetails, LoadTableData } from '../dataTypes';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
interface CardHeader {
    checkbox: boolean;
    cardTitle: string;
    fltOrFtl: string;
}
interface Value {
    firstValue?: string;
    firstValueStyle?: string;
    seccValue?: string;
    seccValueStyle?: string;
    thirdValue?: string;
    thirdValueStyle?: string;
}
interface CardData {
    title?: string;
    value?: Value;
}
const isCardFlippedArray: Array<number> = [];
const isCheckboxCheckedArray: Array<number> = [];
@Component({
    selector: 'app-truckassist-cards',
    templateUrl: './truckassist-cards.component.html',
    styleUrls: ['./truckassist-cards.component.scss'],
    standalone: true,
    imports: [CommonModule, AngularSvgIconModule, NgbPopoverModule],
})
export class TruckassistCardsComponent implements OnInit {
    // All data
    @Input() viewData: LoadDetails[];
    @Input() tableData: LoadTableData[];
    @Input() card: any;
    // Front of cards
    @Input() cardIndex: number;
    @Input() cardHeader: CardHeader;
    @Input() firstLabel: CardData;
    @Input() seccondLabel: CardData;
    @Input() thirdLabel: CardData;
    @Input() fourthLabel: CardData;
    // Back of cards
    @Input() firstLabelBack: CardData;
    @Input() seccondLabelBack: CardData;
    @Input() thirdLabelBack: CardData;
    @Input() fourthLabelBack: CardData;

    tooltip;
    dropdownActions;
    isCardFlipped: Array<number> = [];
    isCardChecked: Array<number> = [];
    constructor(private tableService: TruckassistTableService) {}

    ngOnInit(): void {
        this.tableService.currentSelectOrDeselect.subscribe((response: any) => {
            // console.log(response);
        });
    }
    ngOnChanges(changes: SimpleChanges): void {}

    // Flip card based on card index
    flipCard(index: number) {
        const indexSelected = isCardFlippedArray.indexOf(index);
        if (indexSelected !== -1) {
            isCardFlippedArray.splice(indexSelected, 1);
            this.isCardFlipped = isCardFlippedArray;
        } else {
            isCardFlippedArray.push(index);
            this.isCardFlipped = isCardFlippedArray;
        }
    }
    // When checkbox is selected
    onCheckboxSelect(index: number) {
        const indexSelected = isCheckboxCheckedArray.indexOf(index);
        if (indexSelected !== -1) {
            isCheckboxCheckedArray.splice(indexSelected, 1);
            this.isCardChecked = isCheckboxCheckedArray;
        } else {
            isCheckboxCheckedArray.push(index);
            this.isCardChecked = isCheckboxCheckedArray;
        }
    }
    toggleDropdown(tooltip) {
        this.tooltip = tooltip;
        if (tooltip.isOpen()) {
            tooltip.close();
        } else {
            let actions = [...this.card?.tableDropdownContent.content];
            actions = actions.map((actions: any) => {
                if (actions?.isDropdown) {
                    return {
                        ...actions,
                        isInnerDropActive: false,
                    };
                }

                return actions;
            });
            this.dropdownActions = [...actions];
            tooltip.open({ data: this.dropdownActions });
            console.log(this.dropdownActions);
        }
    }
}
