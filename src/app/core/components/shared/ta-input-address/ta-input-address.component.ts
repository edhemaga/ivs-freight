import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { ITaInput } from '../ta-input/ta-input.config';
import { TaInputService } from '../ta-input/ta-input.service';

export interface Address {
  address: string;
  city: string;
  state: string;
  stateShortName: string;
  country: string;
  zipCode: number | string;
  addressUnit?: number | string;
  streetNumber?: string;
  streetName?: string;
}

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
  public numberOfSpaces: number = 0;

  constructor(
    @Self() public superControl: NgControl,
    private inputService: TaInputService,
    private sharedService: SharedService
  ) {
    this.superControl.valueAccessor = this;
  }

  public handleAddressChange(address: Address) {
    this.inputService.handleAddress(this.sharedService.selectAddress(null, address));
    this.getSuperControl.setValue(this.sharedService.selectAddress(null, address).address);
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
    this.numberOfSpaces = 0;
    this.inputConfig.isRequired && this.getSuperControl.errors
      ? (this.waitValidation = true)
      : (this.waitValidation = false);
  }

  public onBackspace(event): void {
    if (event.keyCode == 8) {
      this.numberOfSpaces = 0;
      if (!this.getSuperControl.value) {
        this.clearInput();
        this.waitValidation = false;
      }
    }
  }

  public manipulateWithInput(event: KeyboardEvent): boolean {
    
    const regex = /^[ ]*$/;

    // Disable first character to be space
    if (
      !this.input.nativeElement.value &&
      regex.test(String.fromCharCode(event.charCode))
    ) {
      event.preventDefault();
      return false;
    }

    // Disable 2 or more space consecutively
    if(regex.test(String.fromCharCode(event.charCode))) {
      this.numberOfSpaces++;
      if(this.numberOfSpaces > 1) {
        event.preventDefault();
        return false;
      }
    }
    else {
      this.numberOfSpaces = 0;
    }

    if (['address'].includes(this.inputConfig.name.toLowerCase())) {
      const regex = /^[A-Za-z0-9 .-]*$/;
      if (regex.test(String.fromCharCode(event.charCode))) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }
  }

  ngOnDestroy(): void {}
}
