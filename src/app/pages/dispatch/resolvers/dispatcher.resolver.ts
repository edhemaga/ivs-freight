import { Injectable } from '@angular/core';

import { forkJoin, Observable, map } from 'rxjs';

// services
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';

// models
import {
    DispatchBoardListResponse,
    DispatchBoardResponse,
    DispatchModalResponse,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class DispatcherResolver {
    constructor(private dispatcherService: DispatcherService) {}
    resolve(): Observable<
        [
            DispatchModalResponse,
            DispatchBoardListResponse | DispatchBoardResponse,
        ]
    > {
        const dispatcherId = localStorage.getItem('dispatchUserSelect')
            ? JSON.parse(localStorage.getItem('dispatchUserSelect')).id
            : -1;

        const dispatchList =
            dispatcherId === -1
                ? this.dispatcherService.getDispatchboardList()
                : this.dispatcherService.getDispatchBoardByDispatcherList(
                      dispatcherId
                  );

        const modalList = this.dispatcherService.getDispatcherList();

        return forkJoin([modalList, dispatchList]).pipe(
            map((list) => {
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
    }
}
