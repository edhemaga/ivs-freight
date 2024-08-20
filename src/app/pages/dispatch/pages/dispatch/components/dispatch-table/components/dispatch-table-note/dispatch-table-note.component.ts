import { Component, Input } from '@angular/core';

// models
import { TruckResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-dispatch-table-note',
    templateUrl: './dispatch-table-note.component.html',
    styleUrls: ['./dispatch-table-note.component.scss'],
})
export class DispatchTableNoteComponent {
    @Input() public truck: TruckResponse;
    @Input() set note(value: string) {
        this._note = value;
    }
    @Input() public isNoteExpanded: boolean;
    @Input() public isHoveringRowIndex: number;
    @Input() public rowIndex: number;
    @Input() public dispatchId: number;

    public noteOpened: boolean;
    public _note: string;

    constructor() {}

    public saveNote(note: string): void {
        this._note = note;
    }

    public toggleNote(opened: any): void {
        this.noteOpened = opened.opened;
    }
}
