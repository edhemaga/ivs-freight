import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

// pipes
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';

@Component({
    selector: 'app-ta-counter',
    templateUrl: './ta-counter.component.html',
    styleUrls: ['./ta-counter.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,

        // Pipe
        ThousandSeparatorPipe,
    ],
})
export class TaCounterComponent {
    @Input() count: number = 0;
    @Input() countColor: string = '#6C6C6C';
    @Input() countBackground: string = '#F7F7F7';
    @Input() countFontWeight: number = 800;
    @Input() countHeight: string = '18px';
    @Input() countWidth: string = '18px';
    @Input() countBorderRadius: string = '2px';
    @Input() countTextBottomPosition: string = '0px';
    @Input() leftPosition: string = '0px';
    @Input() marginLeft: string = '0px';
    @Input() customClass: string = '';
}
