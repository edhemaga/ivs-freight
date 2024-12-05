import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
    NgbModule,
    NgbPopoverModule,
    NgbPopover,
} from '@ng-bootstrap/ng-bootstrap';

// Pipes
import { ThousandToShortFormatPipe } from '@shared/pipes/thousand-to-short-format.pipe';
import { FormatCurrencyPipe } from '@shared/pipes/format-currency.pipe';
import { ThousandSeparatorPipe } from '@shared/pipes';

// Models
import { ProgressDropdownData } from '@shared/components/ta-progres-bar/models/progress-dropdown-data.model';

@Component({
    selector: 'app-ta-progres-bar',
    templateUrl: './ta-progres-bar.component.html',
    styleUrls: ['./ta-progres-bar.component.scss'],
    imports: [
        // Modules
        CommonModule,
        NgbPopoverModule,
        NgbModule,

        // Pipes
        ThousandToShortFormatPipe,
        FormatCurrencyPipe,
        DatePipe,
        ThousandSeparatorPipe,
    ],
    standalone: true,
    providers: [ThousandToShortFormatPipe],
})
export class TaProgresBarComponent implements OnInit {
    @Input() type: string = 'days';
    @Input() text: string | number;
    @Input() percents: number;
    @Input() data: any;
    @Input() columnField: string;
    @Input() isTable: boolean = false;
    @Input() daysExpired: boolean = false;
    @Input() daysToPay: number;

    public progressTooltip: NgbPopover;
    public progressDropdownActive: number = -1;
    public progressDropdownColumnActive: string = '';
    public progressDropdownData: ProgressDropdownData;

    ngOnInit() {}

    get daysPluralization() {
        const text = isNaN(this.text as number) ? this.text : this.text.toString();
        if (text === '1') {
            return 'Day';
        }

        return 'Days';
    }

    // Toggle Progress Dropdown
    public toggleProgressDropdown(tooltip: NgbPopover): void {
        this.progressTooltip = tooltip;

        if (tooltip.isOpen()) {
            tooltip.close();
        } else {
            tooltip.open();
        }

        this.progressDropdownActive = tooltip.isOpen()
            ? this.data.textUnit
            : -1;
        this.progressDropdownColumnActive = tooltip.isOpen()
            ? this.columnField
            : null;
        this.progressDropdownData = {
            row: this.data,
            column: this.data[this.columnField],
        };
    }
}
