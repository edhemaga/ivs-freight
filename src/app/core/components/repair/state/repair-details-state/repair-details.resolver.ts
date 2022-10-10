import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RepairTService } from '../repair.service';
import { RepairListResponse } from 'appcoretruckassist';
import { RepairDetailsState, RepairDetailsStore } from './repair-details.store';

@Injectable({
  providedIn: 'root',
})
export class repairDetailsResolver implements Resolve<RepairDetailsState> {
  constructor(
    private repairService: RepairTService,
    private repairDetailsStore: RepairDetailsStore,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<RepairDetailsState | boolean> {
    const shop_id = route.paramMap.get('id');
    let id = parseInt(shop_id);
    return this.repairService.getRepairList(id).pipe(
      catchError(() => {
        return of('No repair data...');
      }),
      tap((repair: RepairListResponse) => {
        this.repairDetailsStore.set([repair.pagination]);
      })
    );
  }
}
