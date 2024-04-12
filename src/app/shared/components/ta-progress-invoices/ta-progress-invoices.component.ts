import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// pipes
import { FormatCurrency } from '@shared/pipes/format-currency.pipe';

@Component({
    selector: 'app-ta-progress-invoices',
    templateUrl: './ta-progress-invoices.component.html',
    styleUrls: ['./ta-progress-invoices.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FormatCurrency],
})
export class TaProgressInvoicesComponent implements OnInit {
    @Input() invoiceDays: string = '';
    @Input() invoiceCounter: string = '';
    @Input() invoiceTotal: string = '';
    @Input() template: string;
    constructor() {}

    ngOnInit(): void {}
}
