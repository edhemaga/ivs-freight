import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

//Modules
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

//Models
import { LoadStatuses } from './models/load-statuses.model';

@Component({
    selector: 'app-load-modal-statuses',
    templateUrl: './load-modal-statuses.component.html',
    styleUrls: ['./load-modal-statuses.component.scss'],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        NgbPopoverModule,
    ],
})
export class LoadModalStatusesComponent implements OnInit {
    @Input() mode: 'Create' | 'Edit';
    @Input() active: LoadStatuses;
    @Input() statuses: LoadStatuses[];
    @Output() selected: EventEmitter<LoadStatuses[]> = new EventEmitter<
        LoadStatuses[]
    >();

    constructor() {}

    ngOnInit() {}

    public identity(index: number, item: any): number {
        return item.id;
    }

    public onSelectLoadStatus(status: LoadStatuses) {
        this.statuses = this.statuses.map((item) => {
            return {
                ...item,
                active: item.id === status.id,
            };
        });
        this.active = status;
        this.selected.emit(this.statuses);
    }
}
