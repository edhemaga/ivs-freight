import {
    AfterViewInit,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { ColumnConfig } from 'ca-components';
import { Observable, Subject } from 'rxjs';
import { PayrollFacadeService } from '../../../state/services/payroll.service';
import { ModalService } from '@shared/services/modal.service';
import { PayrollDriverFlatRateFacadeService } from '../../../state/services/payroll_flat_rate.service';

@Component({
    selector: 'app-driver-flat-rate-report',
    templateUrl: './driver-flat-rate-report.component.html',
    styleUrls: ['./driver-flat-rate-report.component.scss'],
})
export class DriverFlatRateReportComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    columns: ColumnConfig[];
    @Input() reportId: string;
    @Input() selectedTab: 'open' | 'closed';
    showMap: boolean = false;

    public loading$: Observable<boolean>;

    private destroy$ = new Subject<void>();

    constructor(
        // Services
        private payrollDriverFlatRateFacadeService: PayrollDriverFlatRateFacadeService,
        private payrollFacadeService: PayrollFacadeService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    subscribeToStoreData() {
        this.payrollDriverFlatRateFacadeService.getPayrollDriverFlatRateReport({
            reportId: this.reportId,
        });
    }

    ngAfterViewInit() {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
