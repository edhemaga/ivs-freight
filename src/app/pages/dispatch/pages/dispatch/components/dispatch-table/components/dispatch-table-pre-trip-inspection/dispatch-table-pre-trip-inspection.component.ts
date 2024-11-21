import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, type OnDestroy } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, switchMap, takeUntil } from 'rxjs';

// models
import { EnumValue } from 'appcoretruckassist';

// service
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';

//utils
import { DispatchTableSvgRoutes } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/svg-routes/dispatch-table-svg-routes';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

@Component({
    selector: 'app-dispatch-table-pre-trip-inspection',
    templateUrl: './dispatch-table-pre-trip-inspection.component.html',
    styleUrls: ['./dispatch-table-pre-trip-inspection.component.scss'],
})
export class DispatchTablePreTripInspectionComponent
    implements OnInit, OnDestroy
{
    @Input() set status(value: EnumValue | null) {
        if (value) this._status = value;
    }

    @Input() dispatchBoardId?: number;
    @Input() dispatchId?: number;
    @Input() set time(value: string | null) {
        if (value)
            this._time = MethodsCalculationsHelper.convertDateToTimeFromBackend(
                value,
                true
            );
    }
    @Input() isHoveringRow: boolean;
    @Input() isUnlockable: boolean;

    private _time: string | null;
    private _status: EnumValue;
    private destroy$ = new Subject<void>();
    public dispatchTableSvgRoutes = DispatchTableSvgRoutes;

    constructor(private dispatcherService: DispatcherService) {}

    ngOnInit(): void {}

    get status(): EnumValue {
        return this._status;
    }

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
