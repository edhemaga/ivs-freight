import { Injectable } from '@angular/core';

import { NoteService, PatchNoteCommand } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class NoteUpdateService {
    constructor(private noteService: NoteService) {}

    public updateNote(updateValue: PatchNoteCommand) {
        return this.noteService.apiNotePatch(updateValue);
    }
}
