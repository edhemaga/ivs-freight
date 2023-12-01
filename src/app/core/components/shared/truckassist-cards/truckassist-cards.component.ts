import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
// Models
import {
    CardData,
    CardHeader,
    LoadTableData,
    RightSideCard,
} from '../model/cardData';
import {
    DropdownItem,
    LoadDetails,
    SendDataCard,
} from '../model/cardTableData';
// Services
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';
// Modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Components
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
// Array holding id of fliped cards
const isCardFlippedArray: Array<number> = [];
// Array holding id of checked cards
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
        formatDatePipe,
    ],
})
export class TruckassistCardsComponent implements OnInit {
    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();
    // All data
    @Input() viewData: LoadDetails;
    @Input() tableData: LoadTableData[];
    @Input() card: LoadDetails;
    // For Front And back of the cards
    @Input() deadline: boolean;
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

    public isCardFlipped: Array<number> = [];
    public isCardChecked: Array<number> = [];
    public tooltip;
    public dropdownActions;
    public dropdownOpenedId: number;
    public dropDownIsOpened: number;
    public cardData: LoadDetails;
    public dropDownActive: number;
    constructor(private detailsDataService: DetailsDataService) {}

    ngOnInit(): void {
        console.log(this.card);
    }

    // Flip card based on card index
    public flipCard(index: number) {
        const indexSelected = isCardFlippedArray.indexOf(index);

        if (indexSelected !== -1) {
            isCardFlippedArray.splice(indexSelected, 1);
            this.isCardFlipped = isCardFlippedArray;
        } else {
            isCardFlippedArray.push(index);
            this.isCardFlipped = isCardFlippedArray;
        }

        return;
    }
    // When checkbox is selected
    public onCheckboxSelect(index: number) {
        const indexSelected = isCheckboxCheckedArray.indexOf(index);

        if (indexSelected !== -1) {
            isCheckboxCheckedArray.splice(indexSelected, 1);
            this.isCardChecked = isCheckboxCheckedArray;
        } else {
            isCheckboxCheckedArray.push(index);
            this.isCardChecked = isCheckboxCheckedArray;
        }

        return;
    }
    // Show hide dropdown
    public toggleDropdown(tooltip, cardIndex: number) {
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

        return;
    }
    // Remove Click Event On Inner Dropdown
    public onRemoveClickEventListener() {
        const innerDropdownContent = document.querySelectorAll(
            '.inner-dropdown-action-title'
        );

        innerDropdownContent.forEach((content) => {
            content.removeAllListeners('click');
        });

        return;
    }
    // Dropdown Actions
    public onDropAction(action: DropdownItem) {
        if (!action?.mutedStyle) {
            // Send Drop Action
            this.bodyActions.emit({
                id: this.dropDownActive,
                data: this.card,
                type: action.name,
            });
        }

        this.tooltip.close();

        return;
    }
}
