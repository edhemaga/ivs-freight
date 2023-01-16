import { DispatcherStoreService } from './dispatcher.service';
import { DispatcherQuery } from './dispatcher.query';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

//import { ProductService } from '../product/product.service';

@Injectable({
    providedIn: 'root',
})
export class DispatcherResolverService implements Resolve<any> {
    constructor(
        private dispatcherStoreService: DispatcherStoreService,
        private dispatcherQuery: DispatcherQuery
    ) {}
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        if (this.dispatcherQuery.modalList?.dispatchBoards?.length) {
            return this.dispatcherQuery.modalList;
        } else {
            const dispatcherId = localStorage.getItem('dispatchUserSelect')
                ? JSON.parse(localStorage.getItem('dispatchUserSelect')).id
                : -1;

            const dispatchList =
                dispatcherId == -1
                    ? this.dispatcherStoreService.getDispatchboardList()
                    : this.dispatcherStoreService.getDispatchBoardByDispatcherList(
                          dispatcherId
                      );
            const modalList = this.dispatcherStoreService.getDispatcherList();

            let join = forkJoin([modalList, dispatchList]).pipe(
                map((list: any) => {
                    list[1] =
                        dispatcherId == -1
                            ? list[1]
                            : {
                                  pagination: {
                                      data: [list[1]],
                                  },
                              };

                    this.dispatcherStoreService.dispatcherData = list;

                    return list;
                })
            );

            return join;
        }
        return of(true);
    }
}
