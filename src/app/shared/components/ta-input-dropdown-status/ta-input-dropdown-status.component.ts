import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

// Models
import { SelectedStatus } from '@pages/load/pages/load-modal/models/load-modal-status.model';
import { ITaInput } from '../ta-input/config/ta-input.config';

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
    // Inputs
    @Input() selectedStatus: SelectedStatus = null;
    @Input() options: SelectedStatus[];
    @Input() inputConfig: ITaInput;

    // Outputs
    @Output() selectedItem: EventEmitter<SelectedStatus> =
        new EventEmitter<SelectedStatus>();
    public isDropdownVisible: boolean = false;

    constructor() {}

    ngOnInit(): void {
        console.log(this.selectedStatus);
    }

    public openDropdown(): void {
        this.isDropdownVisible = true;
    }

    public trackByIdentity = (index: number): number => index;

    public changeStatus(status: SelectedStatus): void {
        this.selectedItem.emit(status);
    }
}
