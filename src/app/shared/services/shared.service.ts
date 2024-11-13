import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SharedService {
    public emitAllNoteOpened: EventEmitter<boolean> = new EventEmitter();

    public emitUpdateScrollHeight: EventEmitter<any> = new EventEmitter();
    public emitTableScrolling: EventEmitter<any> = new EventEmitter();
}
