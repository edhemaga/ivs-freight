import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

// services
import { PayrollService } from '@pages/accounting/services/payroll.service';

// constants
import { PayrollCommisionDriverOpenLoads } from '@pages/accounting/pages/payroll/components/payroll-report/utils/constants/payroll-commision-driver-open-loads.constants';
import {
    PayrollOwnerOpenLoads,
    PayrollOwnerOpenLoadsResizable,
} from '@pages/accounting/pages/payroll/components/payroll-report/utils/constants/payroll-owner-open-load.constants';
import {
    PayrollMilesDriverOpenLoads,
    PayrollMilesDriverOpenLoadsResizable,
} from '@pages/accounting/pages/payroll/components/payroll-report/utils/constants/payroll-miles-driver-open-loads.constants';
import { PayrollFacadeService } from '../../state/services/payroll.service';
import { Observable } from 'rxjs';
import { PayrollDriverMileageResponse } from 'appcoretruckassist/model/payrollDriverMileageResponse';

@Component({
    selector: 'app-payroll-report',
    templateUrl: './payroll-report.component.html',
    styleUrls: ['./payroll-report.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PayrollReportComponent implements OnInit {
    @Input() reportId: number;
    payrollReport$: Observable<PayrollDriverMileageResponse[]>;

    reportMainData: any = { loads: [], truck: {}, owner: {}, driver: {} };
    tableSettings: any[] = [];
    tableSettingsResizable: any[] = [];
    title: string = '';

    public payAmount: UntypedFormControl = new UntypedFormControl();

    // @Input() set reportTableData(value) {
    //     if (value.id) {
    //         this.getDataBasedOnTitle(value);
    //     }
    // }

    constructor(
        // Services
        private payrollService: PayrollService,

        // Ref
        private dch: ChangeDetectorRef,
        // Services
        private payrollFacadeService: PayrollFacadeService
    ) {}
    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    subscribeToStoreData() {
        this.payrollFacadeService.getPayrollDriverMileageReport(
            `${this.reportId}`
        );
        this.payrollReport$ =
            this.payrollFacadeService.selectPayrollOpenedReport$;
            this.payrollFacadeService.selectPayrollOpenedReport$.subscribe(payroll => {
                console.log("PAYROLLL", payroll);
            });
    }

    getDataBasedOnTitle(data: { id: number; title: string }) {
        this.title = data.title;
        switch (data.title) {
            case 'Owner':
                this.tableSettings = PayrollOwnerOpenLoads;
                this.tableSettingsResizable = PayrollOwnerOpenLoadsResizable;
                // They changed back in service is same error it need to be checked further to resolve error
                // this.payrollService.getPayrollOwnerOpenReport(data.id).subscribe((res) => {
                //     this.reportMainData = res;
                //     this.dch.detectChanges();
                // });
                break;
            case 'Driver (Commission)':
                this.tableSettings = PayrollCommisionDriverOpenLoads;
                this.payrollService
                    .getPayrollCommisionDriverOpenReport(data.id)
                    .subscribe((res) => {
                        this.reportMainData = res;
                        this.dch.detectChanges();
                    });
                break;
            case 'Driver (Miles)':
                this.tableSettings = PayrollMilesDriverOpenLoads;
                this.tableSettingsResizable =
                    PayrollMilesDriverOpenLoadsResizable;
                this.payrollService.getPayrollMileageDriverOpenReport();
                // Same error as above
                // .subscribe((res) => {
                //     this.reportMainData = res;
                //     this.dch.detectChanges();
                // });
                break;
        }
    }
}
