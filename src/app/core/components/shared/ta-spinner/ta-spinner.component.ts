import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LottieModule } from 'ngx-lottie';

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
        LottieModule,
    ],
})
export class TaSpinnerComponent implements OnChanges {
    @Input() size: string; // small, big
    @Input() color: string; // black, gray, white, blueLight, blueDark

    public lottieSpinner: any;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.size?.currentValue != changes.size?.previousValue) {
            this.lottieSpinner = {
                path: `/assets/lottie/ta-lottie-spinner/${
                    this.size === 'small' ? '18px' : '32px'
                }/${this.color}.json`,
            };
        }
    }
}
