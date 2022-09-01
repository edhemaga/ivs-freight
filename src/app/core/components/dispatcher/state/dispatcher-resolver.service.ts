import { DispatcherStoreService } from './dispatcher.service';
import { DispatcherQuery } from './dispatcher.query';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UserLoggedService } from '../../authentication/state/user-logged.service';
import { configFactory } from 'src/app/app.config';

//import { ProductService } from '../product/product.service';

@Injectable({
  providedIn: 'root',
})
export class DispatcherResolverService implements Resolve<any> {
  constructor(
    private dispatcherStoreService: DispatcherStoreService,
    private dashboardQuery: DispatcherQuery,
    private usServicer:UserLoggedService
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    if (this.dashboardQuery.modalList?.dispatchers?.length) {
      return this.dashboardQuery.modalList;
    } else {
      const dispatchList = this.dispatcherStoreService.getDispatchboardList();
      const modalList = this.dispatcherStoreService.getDispatcherList();

      let join = forkJoin([modalList, dispatchList]).pipe(
        map((list) => {
          this.dispatcherStoreService.dispatcherData = list;

          return list;
        })
      );

      return join;
    }
    return of(true);
  }
}
