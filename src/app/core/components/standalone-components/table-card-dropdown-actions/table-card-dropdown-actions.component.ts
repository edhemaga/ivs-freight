import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { DetailsDataService } from 'src/app/core/services/details-data/details-data.service';
import {
    CardDetails,
    DropdownItem,
    SendDataCard,
} from '../../shared/model/cardTableData';
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'app-table-card-dropdown-actions',
    templateUrl: './table-card-dropdown-actions.component.html',
    styleUrls: ['./table-card-dropdown-actions.component.scss'],
    standalone: true,
    imports: [CommonModule, NgbModule, AngularSvgIconModule],
})
export class TableCardDropdownActionsComponent implements OnInit {
    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();

    @Input() card: CardDetails;

    // Tooltip actions
    public tooltip: NgbTooltip;
    public dropdownActions;
    public dropDownIsOpened: number;
    public dropDownActive: number;
    public cardData: CardDetails;

    constructor(private detailsDataService: DetailsDataService) {}

    ngOnInit(): void {}

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

            this.dropDownActive = tooltip.isOpen() ? card.id : -1;
            this.cardData = card;
            tooltip.open({ data: this.dropdownActions });
            this.detailsDataService.setNewData(card);
        }

        return;
    }

    public onDropAction(action: DropdownItem): void {
        if (!action?.mutedStyle) {
            // Send Drop Action

            this.bodyActions.emit({
                id: this.dropDownActive,
                data: this.cardData,
                type: action.name,
            });
        }
        this.tooltip.close();
        return;
    }

    public onShowInnerDropdown(action): void {
        const newDropdownActions = [...this.dropdownActions];

        newDropdownActions.map((actions) => {
            if (
                actions.isDropdown &&
                actions.isInnerDropActive &&
                actions.title !== action.title
            ) {
                actions.isInnerDropActive = false;
                actions.innerDropElement = null;
            }
        });

        this.dropdownActions = [...newDropdownActions];

        action.isInnerDropActive = !action.isInnerDropActive;
    }
}
