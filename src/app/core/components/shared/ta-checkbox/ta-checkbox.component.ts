import {
  Component,
  Input,
  OnChanges,
  Self,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-ta-checkbox',
  templateUrl: './ta-checkbox.component.html',
  styleUrls: ['./ta-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaCheckboxComponent implements OnChanges, ControlValueAccessor {
  @Input() label: string;
  @Input() required: boolean = false;
  @Input() invalid: boolean = false;
  @Input() disabled: boolean = false;
  @Input() svg: string;
  @Input() name: string = 'ta-checkbox'; // if have multiple checkboxes on same page, forward different name
  @Input() customClass: string;

  constructor(@Self() public superControl: NgControl) {
    this.superControl.valueAccessor = this;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.getSuperControl?.currentValue !=
      changes.getSuperControl?.previousValue
    ) {
      this.getSuperControl.patchValue(changes.getSuperControl?.currentValue);
    }
  }

  get getSuperControl() {
    return this.superControl.control;
  }

  public writeValue(obj: any): void {}

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public onChange(event: any): void {}

  public registerOnTouched(fn: any): void {}
}
