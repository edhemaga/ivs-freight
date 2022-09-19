import { ChangeContext, Options } from '@angular-slider/ngx-slider';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-ta-ngx-slider',
  templateUrl: './ta-ngx-slider.component.html',
  styleUrls: ['./ta-ngx-slider.component.scss'],
})
export class TaNgxSliderComponent {
  @Input() sliderTemplate: string = 'commission';
  @Input() sliderName: string = null;
  @Input() sliderOptions: Options;
  @Input() startedValue: number = 50;
  @Input() customClass: string = null;

  @Output() onUserValueChange: EventEmitter<any> = new EventEmitter<any>();

  rangeSliderForm: FormGroup = new FormGroup({
    sliderControl: new FormControl([0, 5000])
  });

  public userChangeEnd(changes: ChangeContext) {
    console.log('--here-1--')
    if (changes) {
      this.onUserValueChange.emit(changes.value);
    }
  }

  public valueChange(event) {
    console.log('--here--2-')
    if (event) {
      this.onUserValueChange.emit(event);
    }
  }
}
