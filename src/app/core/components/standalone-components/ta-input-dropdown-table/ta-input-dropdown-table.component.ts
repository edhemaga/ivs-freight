import { Component, Input, OnInit } from '@angular/core';
import {
    NgbModule,
    NgbPopoverModule,
    NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';

// modules
import { CommonModule } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CardDetails } from '../../shared/model/cardTableData';

@Component({
    selector: 'app-ta-input-dropdown-table',
    standalone: true,
    imports: [
        // Modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,
        NgbPopoverModule,
    ],
    templateUrl: './ta-input-dropdown-table.component.html',
    styleUrls: ['./ta-input-dropdown-table.component.scss'],
})
export class TaInputDropdownTableComponent implements OnInit {
    @Input() data;

    public tooltip: NgbTooltip;
    public dropDownActive: number;

    constructor() {}

    ngOnInit(): void {}

    // Owner dropdown
    public toggleDropdownOwnerFleet(
        tooltip: NgbTooltip,
        card: CardDetails
    ): void {
        this.tooltip = tooltip;

        if (tooltip.isOpen()) {
        } else {
            this.dropDownActive = tooltip.isOpen() ? card.id : -1;
            tooltip.open({ data: card });
        }

        return;
    }
}
