import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { RoadsideInspectionListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RoadsideService } from '../../roadside.service';
import {
  RoadsideActiveState,
  RoadsideActiveStore,
} from './roadside-active.store';

@Injectable({
  providedIn: 'root',
})
export class RoadsideActiveResolver implements Resolve<RoadsideActiveState> {
  constructor(
    private roadsideService: RoadsideService,
    private roadsideStore: RoadsideActiveStore
  ) {}
  resolve(): Observable<RoadsideActiveState | boolean> {
    return this.roadsideService.getRoadsideList(true, 1, 25).pipe(
      catchError(() => {
        return of('No roadside active data...');
      }),
      tap((roadsidePagination: RoadsideInspectionListResponse) => {
        localStorage.setItem(
          'roadsideTableCount',
          JSON.stringify({
            active: roadsidePagination.active,
            inactive: roadsidePagination.inactive,
          })
        );

        this.roadsideStore.set(roadsidePagination.pagination.data);
      })
    );
  }
}
