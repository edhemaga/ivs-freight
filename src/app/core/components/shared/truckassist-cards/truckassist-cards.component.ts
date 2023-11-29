import {
    Component,
    OnInit,
    Input,
    SimpleChanges,
    EventEmitter,
    Output,
} from '@angular/core';
import {
    CardData,
    CardHeader,
    DropdownItem,
    LoadDetails,
    LoadTableData,
    RightSideCard,
} from './dataTypes';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';

const isCardFlippedArray: Array<number> = [];
const isCheckboxCheckedArray: Array<number> = [];
@Component({
    selector: 'app-truckassist-cards',
    templateUrl: './truckassist-cards.component.html',
    styleUrls: ['./truckassist-cards.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        AngularSvgIconModule,
        NgbPopoverModule,
        AppTooltipComponent,
        NgbTooltipModule,
    ],
})
export class TruckassistCardsComponent implements OnInit {
    @Output() bodyActions: EventEmitter<any> = new EventEmitter();
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
    //Right side of cards
    @Input() firstLabelRightSide: RightSideCard;
    @Input() seccondLabelRightSide: RightSideCard;
    @Input() thirdLabelRightSide: RightSideCard;

    isCardFlipped: Array<number> = [];
    isCardChecked: Array<number> = [];
    tooltip;
    dropdownActions;
    dropdownOpenedId: number;
    dropDownIsOpened: number;
    cardData: LoadDetails;
    dropDownActive;
    constructor(
        private tableService: TruckassistTableService,
        private detailsDataService: DetailsDataService
    ) {}

    ngOnInit(): void {
        this.tableService.currentSelectOrDeselect.subscribe((response: any) => {
            // console.log(this.viewData);
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
    // Show hide dropdown
    toggleDropdown(tooltip, cardIndex: number) {
        this.dropDownIsOpened !== cardIndex
            ? (this.dropDownIsOpened = cardIndex)
            : (this.dropDownIsOpened = null);
        this.tooltip = tooltip;
        if (tooltip.isOpen()) {
            tooltip.close();
        } else {
            let actions = [...this.card?.tableDropdownContent.content];
            actions = actions.map((actions: DropdownItem) => {
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
            this.dropDownActive = tooltip.isOpen() ? this.card.id : -1;
            this.detailsDataService.setNewData(this.card);
        }
    }
    // Remove Click Event On Inner Dropdown
    onRemoveClickEventListener() {
        const innerDropdownContent = document.querySelectorAll(
            '.inner-dropdown-action-title'
        );

        innerDropdownContent.forEach((content) => {
            content.removeAllListeners('click');
        });
    }
    // Dropdown Actions
    onDropAction(action: DropdownItem) {
        if (!action?.mutedStyle) {
            // Send Drop Action
            this.bodyActions.emit({
                id: this.dropDownActive,
                data: this.card,
                type: action.name,
            });
        }
        this.tooltip.close();
    }
}
