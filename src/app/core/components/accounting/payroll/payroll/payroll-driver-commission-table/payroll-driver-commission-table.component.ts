import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PayrollService } from '../payroll.service';

@Component({
    selector: 'app-payroll-driver-commission-table',
    templateUrl: './payroll-driver-commission-table.component.html',
    styleUrls: ['./payroll-driver-commission-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollDriverCommissionTableComponent implements OnInit {
    localSummary: boolean = false;
    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        public payrollService: PayrollService,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.payrollService.toggleTables
            .pipe(takeUntil(this.destroy$))
            .subscribe((type: boolean) => {
                this.localSummary = type;
                this.ref.detectChanges();
            });
    }

    onDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
