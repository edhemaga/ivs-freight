import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnChanges,
    OnDestroy,
    OnInit,
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

// decorators
import { Titles } from 'src/app/core/utils/application.decorators';

// services
import { SharedService } from '../../../../../services/shared/shared.service';
import { DashboardService } from '../../../state/services/dashboard.service';

@Titles()
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent
    implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        private sharedService: SharedService,
        private dashboardService: DashboardService
    ) {}

    ngOnInit(): void {
        this.getOverallCompanyDuration();
    }

    ngAfterViewInit(): void {
        this.emitUpdateScrollHeight();
    }

    ngOnChanges(): void {}

    private emitUpdateScrollHeight(): void {
        setTimeout(() => {
            this.sharedService.emitUpdateScrollHeight.emit(true);
        }, 200);
    }

    private getOverallCompanyDuration(): void {
        this.dashboardService
            .getOverallCompanyDuration()
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
