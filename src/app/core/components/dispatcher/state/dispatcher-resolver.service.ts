import { DispatcherStoreService } from './dispatcher.service';
import { DispatcherQuery } from './dispatcher.query';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
 
//import { ProductService } from '../product/product.service';
 
@Injectable({
  providedIn: 'root'
})
export class DispatcherResolverService implements Resolve<any> {
  constructor(private dispatcherStoreService: DispatcherStoreService, private dashboardQuery: DispatcherQuery) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
      // if( this.dashboardQuery.dispatchersList.length ){
      //   return this.dashboardQuery.dispatchersList;
      // }else{
      //   return this.dispatcherStoreService.getDispatcherList().pipe(
      //       tap(list => {
      //           this.dispatcherStoreService.dispatcherList = list;
      //       })
      //   );
      // }
      return of(true)
  }
}
