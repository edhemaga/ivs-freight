import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import { SharedService } from 'src/app/core/services/shared/shared.service';
import { Address } from '../model/address';
import { ITaInput } from '../ta-input/ta-input.config';
import { TaInputService } from '../ta-input/ta-input.service';

@Component({
  selector: 'app-ta-input-address',
  templateUrl: './ta-input-address.component.html',
  styleUrls: ['../ta-input/ta-input.component.scss'],
})
export class TaInputAddressComponent
  implements  OnDestroy, ControlValueAccessor
{
  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() inputConfig: ITaInput;

  public focusInput: boolean = false;
  public waitValidation: boolean = false;

  constructor(
    @Self() public superControl: NgControl,
    private inputService: TaInputService,
    private sharedService: SharedService
  ) {
    this.superControl.valueAccessor = this;
  }

  public handleAddressChange(address: Address) {
    this.getSuperControl.setValue(this.sharedService.selectAddress(null, address));
  }

  public options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };

  get getSuperControl() {
    return this.superControl.control;
  }

  public writeValue(obj: any): void {
    this.input.nativeElement.value = obj;
  }

  // RegisterOnChange & onChange
  // this two methods, mapped value from input to form in parent component
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public onChange(event: any): void {}

  public registerOnTouched(fn: any): void {}

  public setDisabledState?(isDisabled: boolean): void {
    this.inputConfig.isDisabled = isDisabled;
  }

  public onFocus(): void {
    // Skip valid focus in, if do not have value
    if (this.getSuperControl.value) {
      this.waitValidation = true;
    }

    this.focusInput = true;
  }

  public onBlur(): void {
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

  public clearInput(): void {
    this.input.nativeElement.value = null;
    this.getSuperControl.setValue(null);

    this.inputConfig.isRequired && this.getSuperControl.errors
      ? (this.waitValidation = true)
      : (this.waitValidation = false);
  }

  public getPlaceholderIcon(iconPlaceholder: string): string {
    return this.inputService.getPlaceholderIcon(iconPlaceholder);
  }

  public onBackspace(event): void {
    if (event.keyCode == 8) {
      if (!this.getSuperControl.value) {
        this.clearInput();
        this.waitValidation = false;
      }
    }
  }

  ngOnDestroy(): void {}
}
