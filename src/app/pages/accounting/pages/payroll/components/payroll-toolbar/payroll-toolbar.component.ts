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
import { PayrollFacadeService } from '@pages/accounting/pages/payroll/state/services/payroll.service';

// Enums
import { PayrollTablesStatus } from '@pages/accounting/pages/payroll/state/enums';

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

    @Output() toolBarAction: EventEmitter<PayrollTablesStatus> =
        new EventEmitter();

    public tableData: {
        title: string;
        field: string;
        length: number;
        inactive: boolean;
    }[] = [];

    private destroy$ = new Subject<void>();

    constructor(
        // Services
        private payrollFacadeService: PayrollFacadeService
    ) {}

    ngOnInit(): void {
        this.tableData = [
            {
                title: 'Open',
                field: 'open',
                length: 0,
                inactive: false,
            },
            {
                title: 'Closed',
                field: 'closed',
                length: 0,
                inactive: false,
            },
        ];

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

    public onSelectTab(option: PayrollTablesStatus): void {
        this.toolBarAction.emit(option);
    }

    public expandTable(): void {
        this.payrollFacadeService.setPayrollReportTableExpanded(false);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
