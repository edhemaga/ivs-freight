import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-app-note',
    templateUrl: './app-note.component.html',
    styleUrls: ['./app-note.component.scss'],
})
export class AppNoteComponent implements OnInit {
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
