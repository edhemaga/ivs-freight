import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { NoteService } from './../../../../../appcoretruckassist/api/note.service';

@Injectable({
   providedIn: 'root',
})
export class NoteUpdateService implements OnDestroy {
   private destroy$ = new Subject<void>();

   constructor(private noteService: NoteService) {}

   ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
   }

   public updateNote(updateValue) {
      return this.noteService.apiNotePatch(updateValue);
   }
}
