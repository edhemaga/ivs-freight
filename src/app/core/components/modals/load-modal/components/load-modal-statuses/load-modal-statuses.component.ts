import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

export interface ILoadStatus {
    id: number;
    name: string;
    active: boolean;
    color: string;
}

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
    @Input() active: ILoadStatus;
    @Input() statuses: ILoadStatus[];
    @Output() selected: EventEmitter<ILoadStatus[]> = new EventEmitter<
        ILoadStatus[]
    >();

    constructor() {}

    ngOnInit() {}

    public identity(index: number, item: any): number {
        return item.id;
    }

    public onSelectLoadStatus(status: ILoadStatus) {
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
