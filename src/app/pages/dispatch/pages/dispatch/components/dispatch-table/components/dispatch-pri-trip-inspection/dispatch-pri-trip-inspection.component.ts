import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, type OnDestroy } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, switchMap, takeUntil } from 'rxjs';

// models
import { EnumValue } from 'appcoretruckassist';

//components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// service
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';
@Component({
    selector: 'app-pri-trip-inspection',
    templateUrl: './dispatch-pri-trip-inspection.component.html',
    styleUrls: ['./dispatch-pri-trip-inspection.component.scss'],
    standalone: true,
    imports: [
        AngularSvgIconModule,
        CommonModule,
        NgbModule,

        //Components
        TaAppTooltipV2Component,
    ],
})
export class PriTripInspectionComponent implements OnInit, OnDestroy {
    private _status: EnumValue;
    @Input() set status(value: EnumValue | null) {
        this._status = value;
    }
    @Input() dispatchBoardId: number;

    @Input() dispatchId: number;

    get status(): EnumValue {
        return this._status;
    }

    private destroy$ = new Subject<void>();

    constructor(private dispatcherService: DispatcherService) {}

    ngOnInit(): void {}

    public preTripInspectionDone() {
        this.dispatcherService
            .updatePreTripInspection(this.dispatchId)
            .pipe(
                takeUntil(this.destroy$),
                switchMap(() =>
                    this.dispatcherService.updateDispatchboardRowById(
                        this.dispatchId,
                        this.dispatchBoardId
                    )
                )
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
