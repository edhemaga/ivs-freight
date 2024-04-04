import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'ta-app-note',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './ta-app-note.component.html',
    styleUrls: ['./ta-app-note.component.scss'],
})
export class TaAppNoteComponent implements OnInit {
    @Input() note: any;
    @Input() openAllNotesText: any;
    @Input() note_expanded: boolean = false;
    @Input() rowIndex: number;

    openedAll: boolean;
    constructor() {}

    ngOnInit(): void {}

    public setResizeGpsMain(indx: number): void {
        //this.sharedService.emitOpenNote.next(this.rowIndex);
    }
}
