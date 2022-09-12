import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { LoadResponse } from '../../../../../../../appcoretruckassist/model/loadResponse';
import { LoadTService } from '../load.service';
import { LoadItemStore } from './load-details.store';

@Injectable({
  providedIn: 'root',
})
export class LoatItemResolver implements Resolve<LoadResponse[]> {
  constructor(
    private loadService: LoadTService,
    private loadItemStore: LoadItemStore,
    private router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<LoadResponse[]> | Observable<any> {
    const load_id = route.paramMap.get('id');
    let id = parseInt(load_id);
    return this.loadService.getLoadById(id).pipe(
      catchError((error) => {
        this.router.navigate(['/load']);
        return of('No Load data for...' + load_id);
      }),
      tap((loadResponse: LoadResponse) => {
        this.loadItemStore.set([loadResponse]);
      })
    );
  }
}
