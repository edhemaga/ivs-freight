import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { forkJoin, Observable, tap } from 'rxjs';

// services
import { RoutingStateService } from '@shared/services/routing-state.service';

// store
import {
    RoutingStateState,
    RoutingStateStore,
} from '@pages/routing/state/routing-state.store';

@Injectable({
    providedIn: 'root',
})
export class RoutingStateResolver implements Resolve<RoutingStateState> {
    constructor(
        private routingService: RoutingStateService,
        private routingStore: RoutingStateStore
    ) {}
    resolve(): Observable<any> {
        var companyUserId = JSON.parse(
            localStorage.getItem('user')
        ).companyUserId;

        return forkJoin([
            this.routingService.getMapList(
                companyUserId,
                1,
                4,
                null,
                null,
                null,
                null,
                null
            ),
        ]).pipe(
            tap(([mapList]) => {
                mapList.pagination.data.map((item) => {
                    const mapData = {
                        ...item,
                        type: 'map',
                        fakeId: parseInt([1, item.id].join('')),
                    };
                    this.routingStore.add(mapData);

                    this.routingService
                        .getRouteList(item.id, 1, 8)
                        .pipe()
                        .subscribe((routes: any) => {
                            routes.pagination.data.map((route) => {
                                const routeData = {
                                    ...route,
                                    type: 'route',
                                    mapId: item.id,
                                    fakeId: parseInt([2, route.id].join('')),
                                };

                                this.routingStore.add(routeData);
                            });
                        });
                });
            })
        );
    }
}
