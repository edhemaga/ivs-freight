import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbPopover, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

// Models
import { SelectedStatus } from '@pages/load/pages/load-modal/models/load-modal-status.model';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// Consts
import { InputDropdownStatusSvgRoutes } from '@shared/components/ta-input-dropdown-status/utils/svg-routes/input-dropdown-status-svg-routes';

// Components
import { LoadStatusStringComponent } from '@pages/load/components/load-status-string/load-status-string.component';

@Component({
    selector: 'ta-input-dropdown-status',
    templateUrl: './ta-input-dropdown-status.component.html',
    styleUrls: ['./ta-input-dropdown-status.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        AngularSvgIconModule,
        NgbPopoverModule,

        // Components
        LoadStatusStringComponent,
    ],
})
export class TaInputDropdownStatusComponent implements OnInit {
    public inputDropdownStatusSvgRoutes = InputDropdownStatusSvgRoutes;
    @ViewChild('t2', { static: true }) public popover: NgbPopover;

    // Inputs
    @Input() selectedStatus: SelectedStatus = null;
    @Input() options: SelectedStatus[];
    @Input() inputConfig: ITaInput;

    // Outputs
    @Output() selectedItem: EventEmitter<SelectedStatus> =
        new EventEmitter<SelectedStatus>();

    public isDropdownVisible: boolean = false;
    
    constructor() {}

    ngOnInit(): void { }

    public openDropdown(): void {
        this.isDropdownVisible = true;
    }

    public trackByIdentity = (index: number): number => index;

    public changeStatus(status: SelectedStatus): void {
        this.selectedItem.emit(status);
        this.popover.close();
    }
}
