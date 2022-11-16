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
  selector: 'app-payroll-owner-table',
  templateUrl: './payroll-owner-table.component.html',
  styleUrls: ['./payroll-owner-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollOwnerTableComponent implements OnInit {
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
