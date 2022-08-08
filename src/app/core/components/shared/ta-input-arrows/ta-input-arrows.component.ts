import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ITaInput } from '../ta-input/ta-input.config';

@Component({
  selector: 'app-ta-input-arrows',
  templateUrl: './ta-input-arrows.component.html',
  styleUrls: ['./ta-input-arrows.component.scss'],
})
export class TaInputArrowsComponent implements ControlValueAccessor {
  @Input() name: string;
  @Input() type: string; // 'applicant'
  @Input() required: boolean;
  @Input() inputConfig: ITaInput;

  constructor(@Self() public superControl: NgControl) {
    this.superControl.valueAccessor = this;
  }

  public valueEmmiter(action: string) {
    if (action === 'increment') {
      this.getSuperControl.patchValue(
        (this.getSuperControl.value
          ? parseInt(this.getSuperControl.value)
          : 0) + 1
      );
    } else {
      if (
        parseInt(this.getSuperControl.value) === 0 ||
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
