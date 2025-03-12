import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// Services
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services';

// Enums
import { ePayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';

// Config
import {
    PAYROLL_TOOLBAR_STATUS,
    PAYROLL_TOOLBAR_TAB,
} from '@pages/accounting/pages/payroll/config';
import { eStringPlaceholder } from '@shared/enums';

@Component({
    selector: 'app-payroll-toolbar',
    templateUrl: './payroll-toolbar.component.html',
    styleUrls: ['./payroll-toolbar.component.scss'],
})
export class PayrollToolbarComponent implements OnInit, OnDestroy {
    // Inputs
    @Input() selectedTab: string;
    @Input() tableExpanded: boolean;
    public optionsPopupOpen: boolean = false;

    public filterConfig = PAYROLL_TOOLBAR_STATUS;

    @Output() toolBarAction: EventEmitter<ePayrollTablesStatus> =
        new EventEmitter();

    public tableData: {
        id: number;
        title: string;
        field: string;
        length: number;
        inactive: boolean;
    }[] = PAYROLL_TOOLBAR_TAB;

    private destroy$ = new Subject<void>();

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService
    ) {}

    ngOnInit(): void {
        this.subscribeToStateData();
    }

    private subscribeToStateData(): void {
        this.payrollFacadeService.selectPayrollTabCounts$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (this.tableData.length) {
                    this.tableData[0].length = res.open;
                    this.tableData[1].length = res.closed;
                }
            });
    }

    // Show Toolbar Options Popup
    public onShowOptions(optionsPopup): void {}

    public onSelectTab(option: ePayrollTablesStatus): void {
        this.toolBarAction.emit(option);
    }

    public expandTable(): void {
        this.payrollFacadeService.setPayrollReportTableExpanded(
            false,
            eStringPlaceholder.EMPTY
        );
    }

    public identity(item: {
        id: number;
        title: string;
        field: string;
        length: number;
        inactive: boolean;
    }): number {
        return item.id;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
