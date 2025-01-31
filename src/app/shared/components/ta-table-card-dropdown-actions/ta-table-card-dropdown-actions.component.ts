import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

// services
import { DetailsDataService } from '@shared/services/details-data.service';
import { TableCardDropdownActionsService } from '@shared/components/ta-table-card-dropdown-actions/services/table-card-dropdown-actions.service';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// models
import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';
import { SendDataCard } from '@shared/models/card-models/send-data-card.model';

@Component({
    selector: 'app-ta-table-card-dropdown-actions',
    templateUrl: './ta-table-card-dropdown-actions.component.html',
    styleUrls: ['./ta-table-card-dropdown-actions.component.scss'],
    standalone: true,
    imports: [CommonModule, NgbModule, AngularSvgIconModule],
})
export class TaTableCardDropdownActionsComponent {
    @Output() bodyActions: EventEmitter<SendDataCard> = new EventEmitter();

    @Input() card: CardDetails;

    // Tooltip actions
    public tooltip: NgbTooltip;
    public dropdownActions;
    public dropDownIsOpened: number;
    public dropDownActive: number;
    public cardData: CardDetails;

    constructor(
        private detailsDataService: DetailsDataService,
        private tableDropdownService: TableCardDropdownActionsService
    ) {}

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
        if (!action?.isDisabled) {
            // Send Drop Action
            this.tableDropdownService.openDropdown({
                id: this.dropDownActive,
                data: this.cardData,
                type: action.name,
            });

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
        this.dropdownActions.map((actions) => {
            if (
                actions.isDropdown &&
                actions.isInnerDropActive &&
                actions.title !== action.title
            ) {
                actions.isInnerDropActive = false;
                actions.innerDropElement = null;
            }
        });

        this.dropdownActions = [...this.dropdownActions];

        action.isInnerDropActive = !action.isInnerDropActive;
    }

    public trackByIdentity(id: number): number {
        return id;
    }
}
