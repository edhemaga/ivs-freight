import {
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

// Components
import { ColumnConfig } from 'ca-components';

// Services
import { ModalService } from '@shared/services/modal.service';
import { PayrollDriverCommissionFacadeService } from '../../../state/services/payroll_driver_commision.service';
import { PayrollFacadeService } from '../../../state/services/payroll.service';

// Models
import {
    PayrollDriverCommissionByIdResponse,
    PayrollDriverMileageByIdResponse,
} from 'appcoretruckassist';

import { MilesStopShortReponseWithRowType } from '../../../state/models/payroll.model';
import { PayrollReportTableResponse } from 'ca-components/lib/components/ca-period-content/models/payroll-report-tables.type';
import { CommissionLoadShortReponseWithRowType } from '../../../state/models/driver_commission.model';

@Component({
    selector: 'app-driver-commission-report',
    templateUrl: './driver-commission-report.component.html',
    styleUrls: ['./driver-commission-report.component.scss'],
})
export class DriverCommissionReportComponent implements OnInit, OnDestroy {
    columns: ColumnConfig[];
    @Input() reportId: string;
    @Input() selectedTab: 'open' | 'closed';
    showMap: boolean = false;

    public loading$: Observable<boolean>;

    private destroy$ = new Subject<void>();

    payrollReport$: Observable<PayrollDriverCommissionByIdResponse>;
    payrollReportList: MilesStopShortReponseWithRowType[] = [];
    payrollMileageDriverLoads$: Observable<
        CommissionLoadShortReponseWithRowType[]
    >;

    // Templates
    @ViewChild('customCountTemplate', { static: false })
    public readonly customCountTemplate!: ElementRef;

    @ViewChild('customInvBrk', { static: false })
    public readonly customInvBrk!: ElementRef;

    @ViewChild('customLocationTypeLoad', { static: false })
    public readonly customLocationTypeLoad!: ElementRef;

    constructor(
        // Services
        private payrollCommissionFacadeService: PayrollDriverCommissionFacadeService,
        private payrollFacadeService: PayrollFacadeService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    ngAfterViewInit() {
        this.columns = [
            {
                header: '#',
                field: '',
                sortable: true,
                cellType: 'template',
                cellCustomClasses: 'text-center',
                template: this.customCountTemplate, // Pass the template reference
            },
            {
                header: 'INV, BROKER',
                row: true,
                sortable: false,
                cellType: 'template',
                template: this.customInvBrk, // Pass the template reference
            },
            {
                header: 'INV, BROKER',
                row: true,
                sortable: false,
                cellType: 'template',
                template: this.customLocationTypeLoad, // Pass the template reference
            },
        ];
    }

    subscribeToStoreData() {
        this.payrollCommissionFacadeService.getPayrollDriverCommissionReport({
            reportId: this.reportId,
        });

        this.loading$ = this.payrollFacadeService.payrollReportLoading$;
        this.payrollReport$ =
            this.payrollCommissionFacadeService.selectPayrollOpenedReport$;

        this.payrollMileageDriverLoads$ =
            this.payrollCommissionFacadeService.selectPayrollReportDriverCommissionLoads$;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onReorderItem({
        _included,
        _title,
    }: {
        _included: PayrollReportTableResponse[];
        _title: string;
    }) {
        // let dataSend = {
        //     reportId: `${this.reportId}`,
        //     selectedCreditIds: null,
        //     selectedDeducionIds: null,
        //     selectedBonusIds: null,
        // };
        // if (_title === 'Credit') {
        //     dataSend = {
        //         ...dataSend,
        //         selectedCreditIds: _included.map((load) => load.id),
        //     };
        // } else if (_title === 'Deduction') {
        //     dataSend = {
        //         ...dataSend,
        //         selectedDeducionIds: _included.map((load) => load.id),
        //     };
        // } else if (_title === 'Bonus') {
        //     dataSend = {
        //         ...dataSend,
        //         selectedBonusIds: _included.map((load) => load.id),
        //     };
        // }
        // this.payrollFacadeService.getPayrollDriverMileageReport(dataSend);
    }

    onProccessPayroll(payrollData: PayrollDriverMileageByIdResponse) {
        // this.modalService.openModal(
        //     PayrollProccessPaymentModalComponent,
        //     {
        //         size: 'small',
        //     },
        //     {
        //         type: 'new',
        //         data: {
        //             id: payrollData.id,
        //             totalEarnings:
        //                 (payrollData as any).debt ?? payrollData.totalEarnings,
        //             payrollNumber: payrollData.payrollNumber,
        //             selectedTab: this.selectedTab,
        //         },
        //     }
        // );
    }

    customSortPredicate = (index: number, _: CdkDragDrop<any>): boolean => {
        return true;
        //return this.allowedLoadIds.includes(index);
    };
}
