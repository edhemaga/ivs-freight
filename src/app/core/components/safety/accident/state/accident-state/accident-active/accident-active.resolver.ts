import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AccidentListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AccidentTService } from '../../accident.service';
import { AccidentActiveState, AccidentActiveStore } from './accident-active.store';

@Injectable({
  providedIn: 'root',
})
export class AccidentActiveResolver implements Resolve<AccidentActiveState> {
  constructor(
    private accidentService: AccidentTService,
    private accidentStore: AccidentActiveStore
  ) {}
  resolve(): Observable<AccidentActiveState | boolean> {

    return this.accidentService
    .getAccidentList(true, true, 1, 25)
    .pipe(
      catchError(() => {
        return of('No accident active data...');
      }),
      tap((acidentPagination: AccidentListResponse) => {
        localStorage.setItem(
          'accidentTableCount',
          JSON.stringify({
            active: acidentPagination.active,
            inactive: acidentPagination.inactive,
            nonReportableCount: acidentPagination.nonReportableCount
          })
        );
        
        this.accidentStore.set(acidentPagination.pagination.data);
      })
    );
  }
}
