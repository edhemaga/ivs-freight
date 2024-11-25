import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// enums
import { DropdownOptionsStringEnum } from '@shared/components/ta-dropdown-options/enums';

// svg routes
import { DropdownOptionsSvgRoutes } from '@shared/components/ta-dropdown-options/utils/svg-routes';

// models
import { DropdownItem } from '@shared/models/card-models/card-table-data.model';

@Component({
    selector: 'app-ta-dropdown-options',
    templateUrl: './ta-dropdown-options.component.html',
    styleUrls: ['./ta-dropdown-options.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        TaAppTooltipV2Component,
    ],
})
export class TaDropdownOptionsComponent {
    @Input() options: DropdownItem[] = [];
    @Input() placement: string = DropdownOptionsStringEnum.RIGHT_TOP;
    @Input() isDarkBackground?: boolean = false;

    @Output() dropdownOptionEmitter: EventEmitter<{ type: string }> =
        new EventEmitter<{ type: string }>();

    public dropdownOptionsSvgRoutes = DropdownOptionsSvgRoutes;

    public dropdownPopover: NgbPopover | null = null;

    constructor() {}

    public trackByIdentity = (index: number): number => index;

    public handleDropdownOptionClick(type: string): void {
        this.dropdownOptionEmitter.emit({ type });

        this.dropdownPopover?.close();
    }

    public handleDropdownOpenCloseClick(dropdownPopover: NgbPopover): void {
        if (dropdownPopover.isOpen()) {
            dropdownPopover.close();

            this.dropdownPopover = null;

            this.dropdownOptionEmitter.emit({
                type: DropdownOptionsStringEnum.CLOSE,
            });
        } else {
            this.dropdownPopover?.close();

            this.dropdownPopover = dropdownPopover;

            this.dropdownPopover.open();

            this.dropdownOptionEmitter.emit({
                type: DropdownOptionsStringEnum.OPEN,
            });
        }
    }
}
