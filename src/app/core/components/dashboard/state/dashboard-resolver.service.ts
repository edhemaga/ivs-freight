import { DashboardQuery } from './dashboard.query';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DashboardStoreService } from './dashboard.service';
 
//import { ProductService } from '../product/product.service';
 
@Injectable({
  providedIn: 'root'
})
export class DashboardResolverService implements Resolve<any> {
  constructor(private dashboardStoreService: DashboardStoreService, private dashboardQuery: DashboardQuery) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
      // if( this.dashboardQuery.dashboardStatistics.todayObject ){
      //   return this.dashboardQuery.dashboardStatistics;
      // }else{
      //   return this.dashboardStoreService.getDashboardStats().pipe(
      //       tap(products => {
      //           this.dashboardStoreService.dashStats = products;
      //       })
      //   );
      // }
      return of(true);
  }
}
