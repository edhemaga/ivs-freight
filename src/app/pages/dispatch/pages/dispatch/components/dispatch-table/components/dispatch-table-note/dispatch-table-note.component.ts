import { Component, EventEmitter, Input, Output } from '@angular/core';

// models
import { TruckResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-dispatch-table-note',
    templateUrl: './dispatch-table-note.component.html',
    styleUrls: ['./dispatch-table-note.component.scss'],
})
export class DispatchTableNoteComponent {
    @Input() public truck: TruckResponse;
    @Input() public note: string;
    @Input() public isNoteExpanded: boolean;
    @Input() public isHoveringRowIndex: number;
    @Input() public rowIndex: number;
    @Input() public dispatchId: number;

    @Output() saveNoteValue = new EventEmitter<{
        item: { note: string; dispatchIndex: number };
    }>();
    constructor() {}

    public saveNote(item): void {
        this.saveNoteValue.emit(item);
    }
}
