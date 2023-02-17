import { Injectable, OnDestroy } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { FilterStateStore } from './filter-state.store';
import { FilterState } from './filter-state.model';
import { takeUntil, Subject, Observable, tap, BehaviorSubject } from 'rxjs';
import { TruckTypeService, TrailerTypeService } from 'appcoretruckassist';
import { TruckassistTableService } from 'src/app/core/services/truckassist-table/truckassist-table.service';

@Injectable({ providedIn: 'root' })
export class FilterStateService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(
        private filterStateStore: FilterStateStore,
        private http: HttpClient,
        private TruckTypeService: TruckTypeService,
        private tableService: TruckassistTableService,
        private TrailerTypeService: TrailerTypeService,
    ) {}

    // get() {
    //     this.http
    //         .get('https://akita.com')
    //         .subscribe((entities) => this.filterStateStore.set(entities));
    // }

    // add(filterState: FilterState) {
    //     this.filterStateStore.add(filterState);
    // }

    // update(id, filterState: Partial<FilterState>) {
    //     this.filterStateStore.update(id, filterState);
    // }

    // remove(id: ID) {
    //     this.filterStateStore.remove(id);
    // }
    
    public getTruckType(){
        const truckType = this.TruckTypeService.apiTrucktypeFilterGet()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: any) => {
                    this.tableService.sendActionAnimation({
                        animation: 'truck-type-update',
                        data: data,
                        id: null,
                    }); 

                    truckType.unsubscribe();
                },
            });
            
    }    

    public getTrailerType(){
        const trailerType = this.TrailerTypeService.apiTrailertypeFilterGet()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data: any) => {
                    this.tableService.sendActionAnimation({
                        animation: 'trailer-type-update',
                        data: data,
                        id: null,
                    }); 

                    trailerType.unsubscribe();
                },
            });
    }


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
