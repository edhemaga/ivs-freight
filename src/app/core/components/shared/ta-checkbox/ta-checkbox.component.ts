import { Component, Input, Self} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-ta-checkbox',
  templateUrl: './ta-checkbox.component.html',
  styleUrls: ['./ta-checkbox.component.scss']
})
export class TaCheckboxComponent implements ControlValueAccessor {

  @Input() label: string;
  @Input() customClass: string;

  constructor(@Self() public superControl: NgControl) {
    this.superControl.valueAccessor = this;
  }

  get getSuperControl() {
    return this.superControl.control;
  }

  public writeValue(obj: any): void {}
  
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public onChange(event: any): void {
    this.getSuperControl.setValue(event);
  }

  public registerOnTouched(fn: any): void {}

}
