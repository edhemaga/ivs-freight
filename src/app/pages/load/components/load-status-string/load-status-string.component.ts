import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

// Models
import { SelectedStatus } from '@pages/load/pages/load-modal/models/load-modal-status.model';
import { StatusOrder } from '@pages/load/models/status-order.model';

// Pipes
import { LoadStatusColorPipe } from '@shared/pipes/load-status-color.pipe';
import { DropdownLoadStatusColorPipe } from '@shared/pipes/dropdown-load-status-color.pipe';

@Component({
    selector: 'app-load-status-string',
    templateUrl: './load-status-string.component.html',
    styleUrls: ['./load-status-string.component.scss'],
    standalone: true,
    imports: [
        CommonModule,

        // Pipes
        LoadStatusColorPipe,
        DropdownLoadStatusColorPipe,
    ],
})
export class LoadStatusStringComponent implements OnInit, OnChanges {
    @Input() status: SelectedStatus;
    @Input() justifyStart: boolean;
    @Input() isDetailsLayout?: boolean;
    @Input() isDispatchHistoryModalLayout?: boolean;
    @Input() isDropdownColor?: boolean;
    @Input() statusOrder?: StatusOrder;

    public displayString: string[] = [];
    public className: string;

    constructor() {}

    ngOnInit(): void {
        this.generateDisplayString();
    }

    ngOnChanges() {
        this.generateDisplayString();
    }

    private generateDisplayString(): void {
        this.displayString = this.status.name.split(' ');
        this.className = this.status.valueForRequest.toLowerCase();
    }

    public trackByIdentity(index: number): number {
        return index;
    }
}
