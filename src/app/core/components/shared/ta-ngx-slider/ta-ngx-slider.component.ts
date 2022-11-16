import { ChangeContext, Options } from '@angular-slider/ngx-slider';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Input() minValue: any = 0;
  @Input() maxValue: any = 5000;

  @Output() onUserValueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUserHighValueChange: EventEmitter<any> = new EventEmitter<any>();

  public userChangeEnd(changes: ChangeContext) {
    if (changes) {
      if ( this.sliderTemplate == 'range-slider' ) {
        this.onUserValueChange.emit(changes);
      } else {
        this.onUserValueChange.emit(changes.value);
      }
      
    }
  }

  public valueChange(event) {
    if (event) {
      this.onUserValueChange.emit(event);
    }
  }

  public minValueChange(event){
    this.onUserValueChange.emit(event);
  }

  public highValueChange(event){
    if (event) {
      this.onUserHighValueChange.emit(event);
    }
  }

}
