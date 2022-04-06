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

  public writeValue(obj: any): void {
    this.input.nativeElement.value = obj;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {}

  public setDisabledState?(isDisabled: boolean): void {
    this.inputConfig.isDisabled = isDisabled;
  }

  public onChange(event: any) {}

  public onFocus() {
    // Skip valid focus in, if do not have value
    if (this.getSuperControl.value) {
      this.waitValidation = true;
    }
    this.focusInput = true;
  }

  public onBlur() {
    this.focusInput = false;
    // Required Field
    if (this.inputConfig.isRequired) {
      if (!this.focusInput && this.getSuperControl.invalid) {
        this.waitValidation = true;
      } else {
        this.waitValidation = false;
      }
    }
    // No Required Field
    else {
      if (this.getSuperControl.value && this.getSuperControl.invalid) {
        this.waitValidation = true;
      } else {
        this.waitValidation = false;
      }
    }
  }

  public clearInput() {
    this.input.nativeElement.value = null;
    this.getSuperControl.setValue(null);
    if(this.inputConfig.isRequired && this.getSuperControl.errors) {
      this.waitValidation = true;
    }
    else {
      this.waitValidation = false;
    }
    
  }

  public onCheckBackSpace(event: any) {
    if (event.keyCode === 8 && !this.getSuperControl.value) {
      this.clearInput();
    }
  }

  public getPlaceholderIcon(iconPlaceholder: string): string {
    if(!iconPlaceholder) {
      return null;
    }
    return `assets/svg/common/ic_${iconPlaceholder.toLowerCase()}.svg`
  }

}
