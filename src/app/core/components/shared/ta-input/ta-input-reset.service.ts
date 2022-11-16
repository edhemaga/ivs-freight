import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
   providedIn: 'root',
})
export class TaInputResetService {
   public resetInputSubject: Subject<boolean> = new Subject<boolean>();

   constructor() {}
}
