import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormatCurrency } from '../../../../shared/pipes/format-currency.pipe';

@Component({
    selector: 'app-progress-invoices',
    templateUrl: './progress-invoices.component.html',
    styleUrls: ['./progress-invoices.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FormatCurrency],
})
export class ProgressInvoicesComponent implements OnInit {
    @Input() invoiceDays: string = '';
    @Input() invoiceCounter: string = '';
    @Input() invoiceTotal: string = '';
    @Input() template: string;
    constructor() {}

    ngOnInit(): void {}
}
