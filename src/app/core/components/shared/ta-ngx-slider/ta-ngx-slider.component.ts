import { ChangeContext, Options } from '@angular-slider/ngx-slider';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ta-ngx-slider',
  templateUrl: './ta-ngx-slider.component.html',
  styleUrls: ['./ta-ngx-slider.component.scss']
})
export class TaNgxSliderComponent {
  @Input() sliderTemplate: string = 'commission';
  @Input() sliderName: string = null;
  @Input() sliderOptions: Options;
  @Input() startedValue: number = 50;
  @Input() customClass: string = null;

  @Output() onUserValueChange: EventEmitter<any> = new EventEmitter<any>();

  public userChangeEnd(changes: ChangeContext) {
    this.onUserValueChange.emit(changes.value);
  }

  public valueChange(event) {
    this.onUserValueChange.emit(event)
  }
}
