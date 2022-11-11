import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AccidentListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AccidentTService } from '../../accident.service';
import { AccidentInactiveState, AccidentInactiveStore } from './accident-inactive.store';

@Injectable({
  providedIn: 'root',
})
export class AccidentInactiveResolver implements Resolve<AccidentInactiveState> {
  constructor(
    private accidentService: AccidentTService,
    private accidentStore: AccidentInactiveStore
  ) {}
  resolve(): Observable<AccidentInactiveState | boolean> {
    return this.accidentService
    .getAccidentList(false, true, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 1, 25)
    .pipe(
      catchError(() => {
        return of('No accident inactive data...');
      }),
      tap((acidentPagination: AccidentListResponse) => {
        
        this.accidentStore.set(acidentPagination.pagination.data);
      })
    );
  }
}
