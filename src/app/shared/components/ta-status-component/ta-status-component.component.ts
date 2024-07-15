import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnDestroy,
} from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';

// components
import { LoadStatusStringComponent } from '@pages/load/components/load-status-string/load-status-string.component';

//services
import { LoadService } from '@shared/services/load.service';

//models
import { LoadPossibleStatusesResponse, LoadStatus } from 'appcoretruckassist';

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
    public statusDetails: LoadPossibleStatusesResponse;
    private destroy$ = new Subject<void>();
    public backStatus = StatusComponentSvgRoutes.backStatusImg;

    constructor(private loadService: LoadService) {}

    ngOnInit(): void {
        this.getLoadStatus();
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

    public sendStatus(item: LoadStatus, statusName: LoadStatus): void {
        this.loadService.updateStatus({
            id: this.statusId,
            dataBack: item as LoadStatus,
            dataFront: statusName as LoadStatus,
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
