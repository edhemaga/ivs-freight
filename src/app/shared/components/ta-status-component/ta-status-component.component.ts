import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnDestroy,
    Output,
    EventEmitter,
} from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';

// components
import { LoadStatusStringComponent } from '@pages/load/components/load-status-string/load-status-string.component';

//services
import { LoadService } from '@shared/services/load.service';
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';

//models
import {
    LoadPossibleStatusesResponse,
    LoadStatus,
    type DispatchStatus,
    type DispatchStatusResponse,
} from 'appcoretruckassist';

// Utils
import { StatusComponentSvgRoutes } from '@shared/components/ta-status-component/utils/status-component-svg-routes';

@Component({
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    selector: 'app-ta-status-component',
    templateUrl: './ta-status-component.component.html',
    styleUrls: ['./ta-status-component.component.scss'],
    imports: [
        // modules
        NgbModule,
        CommonModule,
        LoadStatusStringComponent,
    ],
})
export class TaStatusComponentComponent implements OnInit, OnDestroy {
    @Input() statusId: number;
    @Input() isDispatch?: boolean = false;
    @Input() time?: string;
    @Input() status?: DispatchStatusResponse;

    @Output() onRouteEventEmmitter? = new EventEmitter<{
        id: number;
        status: DispatchStatus;
        dataFront: DispatchStatus;
        isRevert?: boolean;
    }>();

    public statusDetails: LoadPossibleStatusesResponse;
    private destroy$ = new Subject<void>();
    public backStatus = StatusComponentSvgRoutes.backStatusImg;

    constructor(
        private loadService: LoadService,
        private dispatchService: DispatcherService
    ) {}

    ngOnInit(): void {
        this.checkIsDispathcStatus();
    }
    public checkIsDispathcStatus(): void {
        if (this.isDispatch) {
            this.getDispatchStatus();
        } else {
            this.getLoadStatus();
        }
    }

    public getLoadStatus(): void {
        this.getLoadStatus;
        this.loadService
            .getLoadStatusDropdownOptions(this.statusId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.statusDetails = res;
            });
    }

    public getDispatchStatus(): void {
        this.dispatchService
            .apiDispatchNextstatusesIdGet(this.statusId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.statusDetails = res;
            });
    }

    public sendStatus(
        item: LoadStatus | DispatchStatus,
        statusName: LoadStatus | DispatchStatus,
        revert?: boolean
    ): void {
        if (this.isDispatch) {
            this.onRouteEventEmmitter.emit({
                id: this.statusId,
                status: item as DispatchStatus,
                dataFront: statusName as DispatchStatus,
                isRevert: revert,
            });
        } else {
            this.loadService.updateStatus({
                id: this.statusId,
                dataBack: item as LoadStatus,
                dataFront: statusName as LoadStatus,
            });
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
