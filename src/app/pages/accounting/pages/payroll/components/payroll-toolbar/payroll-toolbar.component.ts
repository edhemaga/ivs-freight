import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PayrollFacadeService } from '../../state/services/payroll.service';

@Component({
    selector: 'app-payroll-toolbar',
    templateUrl: './payroll-toolbar.component.html',
    styleUrls: ['./payroll-toolbar.component.scss'],
})
export class PayrollToolbarComponent implements OnInit, OnDestroy {
    @Input() selectedTab: string;
    @Input() tableExpanded: boolean;
    public optionsPopupOpen: boolean = false;
    @Output() toolBarAction: EventEmitter<'open' | 'closed'> =
        new EventEmitter();

    tableData: any[] = [];
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
                extended: true,
                gridNameTitle: 'Payroll',
                stateName: 'open',
                isActive: true,
            },
            {
                title: 'Closed',
                field: 'closed',
                length: 0,
                extended: false,
                gridNameTitle: 'Payroll',
                stateName: 'closed',
                isActive: false,
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

    public onSelectTab(option: 'open' | 'closed') {
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
