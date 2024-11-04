import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ColumnConfig } from 'ca-components';

//Services
import { ModalService } from '@shared/services/modal.service';
import { PayrollFacadeService } from '../../../state/services/payroll.service';
import { PayrollDriverOwnerFacadeService } from '../../../state/services/payroll_owner.service';

// Models
import {
    CreatePayrollCreditCommand,
    LoadWithMilesStopResponse,
    PayrollDriverMileageByIdResponse,
    PayrollOwnerResponse,
} from 'appcoretruckassist';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { OwnerLoadShortReponseWithRowType } from '../../../state/models/driver_owner.model';
import { PayrollProccessPaymentModalComponent } from '../../../payroll-modals/payroll-proccess-payment-modal/payroll-proccess-payment-modal.component';
import { IPayrollProccessPaymentModal } from '../../../state/models/payroll.model';
import { PayrollReportTableResponse } from 'ca-components/lib/components/ca-period-content/models/payroll-report-tables.type';
import { PayrollCreditBonusComponent } from '../../../payroll-modals/payroll-credit-bonus/payroll-credit-bonus.component';

@Component({
    selector: 'app-driver-owner-report',
    templateUrl: './driver-owner-report.component.html',
    styleUrls: ['./driver-owner-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverOwnerReportComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    columns: ColumnConfig[];
    @Input() reportId: string;
    @Input() selectedTab: 'open' | 'closed';
    showMap: boolean = false;

    public loading$: Observable<boolean>;
    includedLoads$: Observable<LoadWithMilesStopResponse[]>;

    private destroy$ = new Subject<void>();

    payrollOpenedReport: PayrollOwnerResponse;

    payrollReport$: Observable<PayrollOwnerResponse>;

    payrollOwnerDriverLoads$: Observable<OwnerLoadShortReponseWithRowType[]>;
    openedPayroll: PayrollOwnerResponse;

    // Templates
    @ViewChild('customCountTemplate', { static: false })
    public readonly customCountTemplate!: ElementRef;

    @ViewChild('customInvBrk', { static: false })
    public readonly customInvBrk!: ElementRef;

    @ViewChild('customLocationTypeLoad', { static: false })
    public readonly customLocationTypeLoad!: ElementRef;

    @ViewChild('customPickupHeaderTemplate', { static: false })
    public readonly customPickupHeaderTemplate!: ElementRef;

    @ViewChild('customDeliveryHeaderTemplate', { static: false })
    public readonly customDeliveryHeaderTemplate!: ElementRef;

    @ViewChild('cusstomLoadDescriptionTemplate', { static: false })
    public readonly cusstomLoadDescriptionTemplate!: ElementRef;

    constructor(
        // Services
        private payrollDriverOwnerFacadeService: PayrollDriverOwnerFacadeService,
        private payrollFacadeService: PayrollFacadeService,
        private modalService: ModalService
    ) {}

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    subscribeToStoreData() {
        this.payrollDriverOwnerFacadeService.getPayrollDriverOwnerReport({
            reportId: this.reportId,
        });

        this.loading$ = this.payrollFacadeService.payrollReportLoading$;
        this.payrollReport$ =
            this.payrollDriverOwnerFacadeService.selectPayrollOwnerOpenedReport$;

        this.payrollOwnerDriverLoads$ =
            this.payrollDriverOwnerFacadeService.selectPayrollReportDriverCommissionLoads$;

        this.includedLoads$ =
            this.payrollDriverOwnerFacadeService.selectPayrollReportOwnerIncludedLoads$;

        this.payrollDriverOwnerFacadeService.selectPayrollOwnerOpenedReport$.subscribe(
            (owner) => (this.payrollOpenedReport = owner)
        );
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
                header: 'Pickup',
                headerCellType: 'template',
                headerTemplate: this.customPickupHeaderTemplate,
                field: 'pickups',
                cellType: 'template',
                template: this.cusstomLoadDescriptionTemplate, // Pass the template reference
            },
            {
                header: 'Delivery',
                headerCellType: 'template',
                headerTemplate: this.customDeliveryHeaderTemplate,
                field: 'pickups',
                cellType: 'template',
                template: this.cusstomLoadDescriptionTemplate, // Pass the template reference
            },
            {
                header: 'Empty',
                field: 'emptyMiles',
                cellType: 'text',
                cellCustomClasses: 'text-right',
            },
            {
                header: 'Loaded',
                field: 'loadedMiles',
                cellCustomClasses: 'text-right',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Miles',
                field: 'totalMiles',
                cellCustomClasses: 'text-right',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Revenue',
                field: 'revenue',
                pipeType: 'currency',
                pipeString: 'USD',
                cellCustomClasses: 'text-right',
                cellType: 'text', // Pass the template reference
            },
            {
                header: 'Subtotal',
                field: 'subtotal',
                pipeType: 'currency',
                pipeString: 'USD',
                cellType: 'text',
                cellCustomClasses: 'text-right',
                textCustomClasses: 'b-600',
            },
        ];
    }

    customSortPredicate = (index: number, _: CdkDragDrop<any>): boolean => {
        return true;
    };

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
        this.modalService.openModal(
            PayrollProccessPaymentModalComponent,
            {
                size: 'small',
            },
            {
                type: 'new',
                data: {
                    id: payrollData.id,
                    totalEarnings:
                        (payrollData as any).debt ?? payrollData.earnings,
                    payrollNumber: payrollData.payrollNumber,
                    selectedTab: this.selectedTab,
                    payrollType: 'owner',
                } as IPayrollProccessPaymentModal,
            }
        );
    }

    onReorderDone(drag: CdkDragDrop<any[] | null, any, any>) {
        const loadId = drag.container.data[drag.currentIndex - 1]?.id;
        if (loadId) {
            const loadList = [
                ...this.openedPayroll.includedLoads,
                ...this.openedPayroll.excludedLoads,
            ]
                .filter((load) => load.id <= loadId)
                .map((load) => load.id);

            if (loadList) {
                this.payrollDriverOwnerFacadeService.getPayrollDriverOwnerReport(
                    {
                        reportId: `${this.reportId}`,
                        selectedLoadIds: loadList,
                    }
                );
            }
        }
    }

    public openAddNewModal(type: string) {
        console.log(this.payrollOpenedReport);

        switch (type) {
            case 'Credit':
                this.modalService.openModal(
                    PayrollCreditBonusComponent,
                    {
                        size: 'small',
                    },
                    {
                        type: 'new',
                        data: {
                            driverId: this.payrollOpenedReport.id,
                            truckId: this.payrollOpenedReport.truck.id,
                            payrollType: 'owner',
                        } as CreatePayrollCreditCommand,
                    }
                );
                return;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
