import { Injectable, OnDestroy } from '@angular/core';
import { ID } from '@datorama/akita';
import { HttpClient } from '@angular/common/http';
import { TelematicStateStore } from './telematic-state.store';
import { TelematicState } from './telematic-state.model';
import { takeUntil, Subject, Observable, tap, BehaviorSubject } from 'rxjs';
import { GpsServiceService } from '../../../../global/services/gps-service.service';

@Injectable({ providedIn: 'root' })
export class TelematicStateService implements OnDestroy {
    private destroy$ = new Subject<void>();

    constructor(
        private telematicStateStore: TelematicStateStore,
        private http: HttpClient,
        private gpsService: GpsServiceService
    ) {}

    get() {
        this.http
            .get('https://akita.com')
            .subscribe((entities) => this.telematicStateStore.set(entities));
    }

    add(telematicState: TelematicState) {
        this.telematicStateStore.add(telematicState);
    }

    update(id, telematicState: Partial<TelematicState>) {
        this.telematicStateStore.update(id, telematicState);
    }

    remove(id: ID) {
        this.telematicStateStore.remove(id);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
