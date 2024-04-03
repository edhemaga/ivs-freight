import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Store
import { DispatcherQuery } from '../state/dispatcher.query';

// Services
import { DispatcherService } from '../services/dispatcher.service';

@Injectable({
    providedIn: 'root',
})
export class DispatcherResolver implements Resolve<any> {
    constructor(
        // Services
        private dispatcherService: DispatcherService,

        // Store
        private dispatcherQuery: DispatcherQuery
    ) {}
    resolve(): Observable<any> {
        const dispatcherId = localStorage.getItem('dispatchUserSelect')
            ? JSON.parse(localStorage.getItem('dispatchUserSelect')).id
            : -1;

        const dispatchList =
            dispatcherId == -1
                ? this.dispatcherService.getDispatchboardList()
                : this.dispatcherService.getDispatchBoardByDispatcherList(
                      dispatcherId
                  );
        const modalList = this.dispatcherService.getDispatcherList();

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

                this.dispatcherService.dispatcherData = list;

                return list;
            })
        );

        return join;
    }
}
