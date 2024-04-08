import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModule, NgbPopoverModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ThousandToShortFormatPipe } from '../../pipes/thousand-to-short-format.pipe';

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
    ],
    standalone: true,
    providers: [ThousandToShortFormatPipe],
})
export class TaProgresBarComponent implements OnInit {
    @Input() type: string = 'days';
    @Input() text: string;
    @Input() percents: number;
    @Input() data: any;
    @Input() columnField: string;
    @Input() isTable: boolean = false;
    progressTooltip: NgbPopover;
    progressDropdownActive: number = -1;
    progressDropdownColumnActive: string = '';
    progressDropdownData: any;

    ngOnInit() {}

    // Toggle Progress Dropdown
    toggleProgressDropdown(tooltip: NgbPopover) {
        this.progressTooltip = tooltip;

        if (tooltip.isOpen()) {
            tooltip.close();
        } else {
            tooltip.open();
        }

        this.progressDropdownActive = tooltip.isOpen() ? this.data.textUnit : -1;
        this.progressDropdownColumnActive = tooltip.isOpen()
            ? this.columnField
            : '';
        this.progressDropdownData = { row: this.data, column: this.data[this.columnField] };
    }
}
