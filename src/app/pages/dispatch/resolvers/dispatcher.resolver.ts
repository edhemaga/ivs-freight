import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { forkJoin, Observable, map } from 'rxjs';

// Services
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';

@Injectable({
    providedIn: 'root',
})
export class DispatcherResolver implements Resolve<any> {
    constructor(
        // Services
        private dispatcherService: DispatcherService
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
                console.log('list', list);

                list[1] =
                    dispatcherId === -1
                        ? list[1]
                        : {
                              dispatchBoards: [list[1]],
                          };

                this.dispatcherService.dispatcherData = list;

                return list;
            })
        );

        return join;
    }
}
