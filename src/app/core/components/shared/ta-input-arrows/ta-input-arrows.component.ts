import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ITaInput } from '../ta-input/ta-input.config';

@Component({
  selector: 'app-ta-input-arrows',
  templateUrl: './ta-input-arrows.component.html',
  styleUrls: ['./ta-input-arrows.component.scss'],
})
export class TaInputArrowsComponent implements OnInit, ControlValueAccessor {
  @Input() name: string;
  @Input() type: string; // 'applicant'
  @Input() required: boolean;
  @Input() inputConfig: ITaInput;
  @Input() selectedMode?: string;

  private interval: any = null;

  constructor(@Self() public superControl: NgControl) {
    this.superControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.buttonHolding();
  }

  private buttonHolding() {
    const decrement = document.querySelector('.minus-icon');
    const increment = document.querySelector('.plus-icon');

    this.buttonAction(decrement, 'decrement');
    this.buttonAction(increment, 'increment');
  }

  private buttonAction(element: any, action: string) {
    element.addEventListener('mousedown', (e: any) => {
      this.changeValue(action);

      this.interval = setInterval(() => {
        this.changeValue(action);
      }, 200);
    });

    element.addEventListener('mouseup', (e: any) => {
      clearInterval(this.interval);
    });
  }

  private changeValue(action: string) {
    if (action === 'increment') {
      if (parseInt(this.getSuperControl.value) === 12) {
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
        parseInt(this.getSuperControl.value) === 1 ||
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
  public onChange(event: any): void {}
  public registerOnTouched(fn: any): void {}
}
