import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

// Models
import { CardRows, LoadTableData } from '../model/cardData';
import {
    DropdownItem,
    CardDetails,
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
import { TaNoteComponent } from 'src/app/core/components/shared/ta-note/ta-note.component';
import { ProgresBarComponent } from './progres-bar/progres-bar.component';

// Pipes
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';
import { formatCurrency } from 'src/app/core/pipes/formatCurrency.pipe';
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';
import { ConstantStringTableComponentsEnum } from 'src/app/core/utils/enums/table-components.enums';

@Component({
    selector: 'app-truckassist-cards',
    templateUrl: './truckassist-cards.component.html',
    styleUrls: ['./truckassist-cards.component.scss'],
    standalone: true,
    providers: [formatCurrency, formatDatePipe, TaThousandSeparatorPipe],
    imports: [
        //modules
        CommonModule,
        AngularSvgIconModule,
        NgbPopoverModule,
        NgbTooltipModule,

        //components
        AppTooltipComponent,
        TaNoteComponent,
        ProgresBarComponent,

        //pipes
        formatDatePipe,
    ],
})
export class TruckassistCardsComponent implements OnInit {
    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();

    // All data
    @Input() viewData: CardDetails[];
    @Input() tableData: LoadTableData[];

    // Page
    @Input() page: string;
    @Input() selectedTab: string;
    // For Front And back of the cards
    @Input() deadline: boolean;

    // Card body endpoints
    @Input() cardTitle: string;
    @Input() rows: number[];
    @Input() displayRowsFront: CardRows;
    @Input() displayRowsBack: CardRows;

    public isCardFlipped: Array<number> = [];
    public isCardChecked: Array<number> = [];
    public tooltip;
    public dropdownActions;
    public dropdownOpenedId: number;
    public dropDownIsOpened: number;
    public cardData: CardDetails;
    public dropDownActive: number;
    // Array holding id of fliped cards
    public isCardFlippedArray: number[] = [];

    // Array holding id of checked cards
    public isCheckboxCheckedArray: number[] = [];

    constructor(
        private detailsDataService: DetailsDataService,
        private formatCurrency: formatCurrency,
        private formatDate: formatDatePipe,
        private TaThousandSeparatorPipe: TaThousandSeparatorPipe
    ) {}

    //---------------------------------------ON INIT---------------------------------------
    ngOnInit(): void {}

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

    // When checkbox is selected
    public onCheckboxSelect(index: number): void {
        const indexSelected = this.isCheckboxCheckedArray.indexOf(index);

        if (indexSelected !== -1) {
            this.isCheckboxCheckedArray.splice(indexSelected, 1);
            this.isCardChecked = this.isCheckboxCheckedArray;
        } else {
            this.isCheckboxCheckedArray.push(index);
            this.isCardChecked = this.isCheckboxCheckedArray;
        }

        return;
    }

    // Show hide dropdown
    public toggleDropdown(tooltip, card: CardDetails): void {
        this.tooltip = tooltip;
        if (tooltip.isOpen()) {
            tooltip.close();
            this.dropDownIsOpened = null;
        } else {
            if (card?.tableDropdownContent?.content) {
                this.dropDownIsOpened = card.id;
                let actions = [...card.tableDropdownContent.content];

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
            }

            tooltip.open({ data: this.dropdownActions });
            this.detailsDataService.setNewData(card);
        }

        return;
    }

    // Remove Click Event On Inner Dropdown
    public onRemoveClickEventListener(): void {
        const innerDropdownContent = document.querySelectorAll(
            '.inner-dropdown-action-title'
        );

        innerDropdownContent.forEach((content) => {
            content.removeAllListeners('click');
        });

        return;
    }

    // Dropdown Actions
    public onDropAction(action: DropdownItem, card: CardDetails): void {
        if (!action?.mutedStyle) {
            // Send Drop Action
            this.bodyActions.emit({
                id: this.dropDownActive,
                data: card,
                type: action.name,
            });
        }
        this.tooltip.close();
        return;
    }

    //Remove quotes from string to convert into endpoint
    public getValueByStringPath(obj: CardDetails, path: string): string {
        if (path === ConstantStringTableComponentsEnum.NO_ENDPOINT)
            return ConstantStringTableComponentsEnum.NO_ENDPOINT_2;

        // Value is obj key
        const value = obj[path];

        const valueOfKeyIsNullOrUndefined = !path
            .split('.')
            .reduce((acc, part) => acc && acc[part], obj);

        const valueOfKeyIsNotZero =
            path.split('.').reduce((acc, part) => acc && acc[part], obj) !== 0;

        //Check if value is null return / and if it is 0 return expired
        if (valueOfKeyIsNullOrUndefined && valueOfKeyIsNotZero)
            return ConstantStringTableComponentsEnum.SLASH;

        // Transform number to descimal with $ and transform date
        switch (path) {
            case ConstantStringTableComponentsEnum.AVAILABLE_CREDIT:
            case ConstantStringTableComponentsEnum.REVENUE:
                return this.formatCurrency.transform(value);
            case ConstantStringTableComponentsEnum.HIRED:
                return this.formatDate.transform(value);
            case ConstantStringTableComponentsEnum.MILEAGE:
                return this.TaThousandSeparatorPipe.transform(value);
            default:
                return path
                    .split('.')
                    .reduce((acc, part) => acc && acc[part], obj);
        }
    }

    // Track By For Table Row
    public trackCard(item: number): number {
        return item;
    }
}
