import {
   ChangeDetectionStrategy,
   ChangeDetectorRef,
   Component,
   EventEmitter,
   OnInit,
   Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PayrollService } from '../payroll.service';

@Component({
   selector: 'app-payroll-driver-table',
   templateUrl: './payroll-driver-table.component.html',
   styleUrls: ['./payroll-driver-table.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollDriverTableComponent implements OnInit {
   @Output() summaryControll = new EventEmitter<any>();
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

   toggleSummary() {
      this.localSummary = !this.localSummary;
      this.summaryControll.emit();
   }

   onDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
   }
}
