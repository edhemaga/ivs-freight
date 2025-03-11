import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    AfterViewInit,
    ViewContainerRef,
    OnDestroy,
    ViewChildren,
    QueryList,
} from '@angular/core';
import { Observable, takeUntil, Subject } from 'rxjs';

// Pipes
import { NameInitialsPipe } from '@shared/pipes/name-initials.pipe';

// Services
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services';
// Models

import { IPayrollCountsSelector } from '@pages/accounting/pages/payroll/state/models';

// Enums
import {
    ePayrollTable,
    ePayrollTablesStatus,
} from '@pages/accounting/pages/payroll/state/enums';

// Components
import { PayrollListSummaryOverview } from 'ca-components';
@Component({
    selector: 'app-payroll',
    templateUrl: './payroll.component.html',
    styleUrls: ['./payroll.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [NameInitialsPipe],
})
export class PayrollComponent implements OnInit, AfterViewInit, OnDestroy {
    // Templates
    @ViewChildren('container', { read: ViewContainerRef })
    containers!: QueryList<ViewContainerRef>;

    public ePayrollTable = ePayrollTable;
    public ePayrollTablesStatus = ePayrollTablesStatus;

    public payrollType: string;
    public payrollReportType: string;

    public selectedOpenFromList: {
        fullName: string;
        payrollCount: number;
        id: number;
        title: ePayrollTable;
        hideAvatar?: boolean;
    };

    public selectedTabForReport = ePayrollTablesStatus.OPEN;
    public selectedTab = ePayrollTablesStatus.OPEN;

    // THIS IS TEST FOR TABLE RESIZER
    private tableContainerWidth: number = 0;
    private resizeObserver: ResizeObserver;

    public payrollCountsResponse$: Observable<IPayrollCountsSelector>;

    public reportTableDataId: string = '';
    public reportTableExpanded$: Observable<boolean>;
    public openedIndex: number = -1;

    private destroy$ = new Subject<void>();

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService
    ) {}

    public subscribeToStoreData(): void {
        this.reportTableExpanded$ =
            this.payrollFacadeService.reportTableExpanded$;
        this.payrollFacadeService.getPayrollCounts(true);
        this.payrollCountsResponse$ =
            this.payrollFacadeService.selectPayrollCounts$;

        this.payrollFacadeService.selectPayrollOpenedTab$
            .pipe(takeUntil(this.destroy$))
            .subscribe((tab) => {
                this.selectedTab = tab;
            });
    }

    ngOnInit(): void {
        this.subscribeToStoreData();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.observTableContainer();
        }, 10);
    }

    public hideShowTables(data: {
        payrollSummary: PayrollListSummaryOverview;
        status: boolean;
        index: number;
    }): void {
        this.openedIndex = this.openedIndex === data.index ? -1 : data.index;
        if (data.status) {
            this.payrollType = `${data.payrollSummary.text}${
                data.payrollSummary.type ? ` ${data.payrollSummary.type}` : ``
            }`;

            this.selectedOpenFromList = undefined;
        }
    }

    public handleOpenExpandedReport(
        event: {
            driver: { fullName: string; id: number };
            truck: { truckNumber: string; id: number };
            owner: string;
            payrollCount: number;
        },
        title: ePayrollTable
    ) {
        const fullName = event.truck
            ? `${event.truck?.truckNumber} - ${event.owner}`
            : event.driver.fullName;
        this.selectedOpenFromList = {
            fullName: fullName,
            payrollCount: event.payrollCount,
            id: event.truck?.id || event.driver?.id,
            title,
            hideAvatar: !!event.truck,
        };
    }

    public handleOpenExpandedListReport(
        event: { id: string },
        expandTable: boolean
    ) {
        if (this.reportTableDataId != event?.id || !expandTable) {
            this.reportTableDataId = event.id;
            if (this.payrollReportType != this.payrollType) {
                this.payrollReportType = this.payrollType;
            }

            if (this.selectedTabForReport != this.selectedTab) {
                this.selectedTabForReport = this.selectedTab;
            }
            this.payrollFacadeService.setPayrollReportTableExpanded(
                true,
                event.id
            );
        }
    }

    public expandFromTables<T extends { id: string }>(
        payrollType?: string,
        data?: T,
        expandedTable?: boolean
    ) {
        if (data && (this.reportTableDataId != data?.id || !expandedTable)) {
            this.reportTableDataId = data.id;
            this.payrollFacadeService.setPayrollReportTableExpanded(
                true,
                data.id
            );

            if (payrollType) {
                if (this.payrollReportType != payrollType) {
                    this.selectedTabForReport = this.selectedTab;
                    this.payrollReportType = payrollType;
                } else if (this.selectedTabForReport != this.selectedTab) {
                    this.selectedTabForReport = this.selectedTab;
                }
            }
        }
    }

    private observTableContainer() {
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                this.tableContainerWidth = entry.contentRect.width;
            });
        });

        this.resizeObserver.observe(document.querySelector('.table-container'));
    }

    public onToolBarAction(tabStatus: ePayrollTablesStatus): void {
        this.payrollFacadeService.setPayrollOpenedTab(tabStatus);
        this.openedIndex = -1;
        this.payrollFacadeService.getPayrollCounts(true);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public closeOpenPreview(e: Event): void {
        e.preventDefault();
        e.stopPropagation();

        this.selectedOpenFromList = undefined;
    }
}