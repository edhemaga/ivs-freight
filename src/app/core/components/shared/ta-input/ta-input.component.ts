import { Component, ElementRef, Input, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ITaInput } from './ta-input.config';

@Component({
  selector: 'app-ta-input',
  templateUrl: './ta-input.component.html',
  styleUrls: ['./ta-input.component.scss'],
})
export class TaInputComponent implements ControlValueAccessor {
  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() inputConfig: ITaInput;

  public focusInput: boolean = false;
  public waitValidation: boolean = false;

  constructor(@Self() public superControl: NgControl) {
    this.superControl.valueAccessor = this;
  }

  get getSuperControl() {
    return this.superControl.control;
  }

  writeValue(obj: any): void {
    this.input.nativeElement.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    this.inputConfig.isDisabled = isDisabled;
  }

  onChange(event: any) {}

  onFocus() {
    if (this.getSuperControl.value) {
      this.waitValidation = true;
    }
    this.focusInput = true;
  }

  onBlur() {
    if(this.getSuperControl.value && this.getSuperControl.invalid) {
      this.waitValidation = true;
    }
    else {
      this.waitValidation = false;
    }
    this.focusInput = false;
  }

  clearInput() {
    this.input.nativeElement.value = null;
    this.getSuperControl.setValue(null);
    this.waitValidation = false;
  }

  onCheckBackSpace(event: any) {
    if (event.keyCode === 8 && !this.getSuperControl.value) {
      this.clearInput();
    }
  }
}
