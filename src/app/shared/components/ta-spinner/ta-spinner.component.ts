import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LottieComponent } from 'ngx-lottie';

@Component({
    selector: 'app-ta-spinner',
    templateUrl: './ta-spinner.component.html',
    styleUrls: ['./ta-spinner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        // Components
        LottieComponent,
    ],
})
export class TaSpinnerComponent implements OnChanges {
    @Input() size?: string; // small, big
    @Input() color?: string; // black, gray, white, blueLight, blueDark
    @Input() isBarSpinner?: boolean = false;

    public lottieSpinner: any;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.size?.currentValue != changes.size?.previousValue) {
            this.lottieSpinner = {
                ...this.lottieSpinner,
                path: `/assets/lottie/ta-lottie-spinner/${
                    this.size === 'small' ? '18px' : '32px'
                }/${this.color}.json`,
            };
        }
    }
}
