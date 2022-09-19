import { AfterViewInit, Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ITaInput } from '../ta-input/ta-input.config';

@Component({
  selector: 'app-ta-input-arrows',
  templateUrl: './ta-input-arrows.component.html',
  styleUrls: ['./ta-input-arrows.component.scss'],
})
export class TaInputArrowsComponent
  implements AfterViewInit, ControlValueAccessor
{
  @Input() name: string;
  @Input() type: string; // 'applicant'
  @Input() required: boolean;
  @Input() minimum: number = 1;
  @Input() maximum: number = 12;
  @Input() elementOrder: number;

  @Input() inputConfig: ITaInput;
  @Input() selectedMode?: string;

  private interval: any = null;

  constructor(@Self() public superControl: NgControl) {
    this.superControl.valueAccessor = this;
  }

  ngAfterViewInit() {
    this.buttonHolding(this.elementOrder);
  }

  private buttonHolding(order: number) {
    const decrement = document.querySelector(`.minus-icon-${order}`);
    const increment = document.querySelector(`.plus-icon-${order}`);

    this.buttonAction(decrement, 'decrement');
    this.buttonAction(increment, 'increment');
  }

  private buttonAction(element: any, action: string) {
    element.addEventListener('mousedown', () => {
      this.changeValue(action);

      this.interval = setInterval(() => {
        this.changeValue(action);
      }, 200);
    });

    element.addEventListener('mouseup', () => {
      clearInterval(this.interval);
    });
  }

  private changeValue(action: string) {
    if (action === 'increment') {
      if (parseInt(this.getSuperControl.value) === this.maximum) {
        return;
      }
      this.getSuperControl.patchValue(
        (this.getSuperControl.value
          ? parseInt(this.getSuperControl.value)
          : 0) + 1
      );
    }
    // decrement
    else {
      if (
        parseInt(this.getSuperControl.value) === this.minimum ||
        !this.getSuperControl.value
      ) {
        return;
      }

      this.getSuperControl.patchValue(
        (this.getSuperControl.value
          ? parseInt(this.getSuperControl.value)
          : 0) - 1
      );
    }
  }

  get getSuperControl() {
    return this.superControl.control;
  }

  public writeValue(obj: any): void {}
  public registerOnChange(fn: any): void {}
  public onChange(): void {}
  public registerOnTouched(fn: any): void {}
}
