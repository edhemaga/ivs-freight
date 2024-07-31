import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

//Models
import { FuelStopResponse } from 'appcoretruckassist';

//Services
import { FuelService } from '@shared/services/fuel.service';

//Store
import { FuelItemStore } from '@pages/fuel/state/fuel-details-state/fuel-details.store';

@Injectable({
    providedIn: 'root',
})
export class FuelDetailsResolver  {
    pageIndex: number = 1;
    pageSize: number = 25;
    constructor(
        private fuelService: FuelService,
        private fuelItemStore: FuelItemStore,
        private router: Router
    ) {}
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const id = route.paramMap.get('id');
        let fuelid = parseInt(id);

        return this.fuelService.getFuelStopById(fuelid).pipe(
            catchError(() => {
                this.router.navigate(['/fuel']);
                return of('No fuel data for...' + fuelid);
            }),
            tap((fuelResponse: FuelStopResponse) => {
                this.fuelItemStore.set([fuelResponse]);
            })
        );
    }
}
