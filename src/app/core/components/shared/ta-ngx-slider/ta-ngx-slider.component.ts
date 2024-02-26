import {
    ChangeContext,
    NgxSliderModule,
    Options,
} from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng5SliderModule } from 'ng5-slider';

@Component({
    selector: 'app-ta-ngx-slider',
    templateUrl: './ta-ngx-slider.component.html',
    styleUrls: ['./ta-ngx-slider.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSliderModule,
        Ng5SliderModule,
    ],
})
export class TaNgxSliderComponent {
    @Input() sliderTemplate: string = 'commission';
    @Input() sliderName: string = null;
    @Input() sliderOptions: Options;
    @Input() startedValue: number = 50;
    @Input() customClass: string = null;
    @Input() minValue: number = 0;
    @Input() maxValue: number = 5000;

    @Output() onUserValueChange: EventEmitter<ChangeContext | number> =
        new EventEmitter<ChangeContext | number>();
    @Output() onUserHighValueChange: EventEmitter<ChangeContext> =
        new EventEmitter<ChangeContext>();

    @ViewChild('slider', { static: false }) slider: any; //leave any for now

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.refreshSlider();
        }, 500);
    }

    public userChangeEnd(changes: ChangeContext) {
        if (changes) {
            if (this.sliderTemplate == 'range-slider') {
                this.onUserValueChange.emit(changes);
            } else {
                this.onUserValueChange.emit(changes.value);
            }
        }
    }

    public valueChange(event: ChangeContext): void {
        if (event) {
            this.onUserValueChange.emit(event);
        }
    }

    public minValueChange(event: ChangeContext): void {
        this.onUserValueChange.emit(event);
    }

    public highValueChange(event: ChangeContext): void {
        if (event) {
            this.onUserHighValueChange.emit(event);
        }
    }

    public refreshSlider(): void {
        if (this.slider) {
            this.slider.onResize();
        }
    }
}
