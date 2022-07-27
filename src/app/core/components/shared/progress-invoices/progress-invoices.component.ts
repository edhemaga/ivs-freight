import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-progress-invoices',
  templateUrl: './progress-invoices.component.html',
  styleUrls: ['./progress-invoices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressInvoicesComponent implements OnInit {
  @Input() invoiceDays: string = '';
  @Input() invoiceCounter: string = '';
  @Input() invoiceTotal: string = '';
  @Input() template: string;
  constructor() {}

  ngOnInit(): void {}
}
