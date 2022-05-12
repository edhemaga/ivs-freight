import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
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
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() inputConfig: ITaInput;

  @Output() selectedAddress: EventEmitter<Address> = new EventEmitter<Address>(
    null
  );

  public focusInput: boolean = false;
  public waitValidation: boolean = false;
  public numberOfSpaces: number = 0;

  public activeAddress: Address = null;
  public invalidAddress: boolean = false;

  constructor(
    @Self() public superControl: NgControl,
    private inputService: TaInputService,
    private sharedService: SharedService
  ) {
    this.superControl.valueAccessor = this;
  }

  ngOnInit(): void {
    if (this.activeAddress) {
      this.getSuperControl.valueChanges
        .pipe(untilDestroyed(this))
        .subscribe((value) => {
          if (value !== this.activeAddress) {
            this.invalidAddress = true;
          }
        });
    }
  }

  public handleAddressChange(address: Address) {
    this.activeAddress = this.sharedService.selectAddress(null, address);
    this.invalidAddress = false;
    this.selectedAddress.emit(this.activeAddress);

    this.getSuperControl.setValue(
      this.sharedService.selectAddress(null, address).address
    );
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

    if (!this.activeAddress && this.waitValidation) {
      this.invalidAddress = true;
    }
  }

  public onBlur(): void {
    this.focusInput = false;

    if (!this.activeAddress) {
      this.invalidAddress = true;
    }

    // Required Field
    if (this.inputConfig.isRequired) {
      if (!this.focusInput && this.getSuperControl.errors) {
        this.waitValidation = true;
      } else {
        this.waitValidation = false;
      }
    }

    // No Required Field
    else {
      if (this.getSuperControl.value && this.getSuperControl.errors) {
        this.waitValidation = true;
      } else {
        this.waitValidation = false;
      }
    }

    console.log("BLUR ADDRESS")
    console.log("REQUIRED ", this.inputConfig.isRequired)
    console.log("VALUE ",this.getSuperControl.value)
    console.log("WAIT VALIDATION ", this.waitValidation)
    console.log("INVALID ADDRESS, ", this.invalidAddress)
    console.log("INVALID CONTROL ", this.getSuperControl.invalid)
    console.log("FOCUS ", !this.focusInput)
   
  }

  public clearInput(): void {
    this.input.nativeElement.value = null;
    this.getSuperControl.setValue(null);
    this.numberOfSpaces = 0;
    this.inputConfig.isRequired && this.getSuperControl.errors
      ? (this.waitValidation = true)
      : (this.waitValidation = false);
    this.activeAddress = null;
    this.invalidAddress = false;
  }

  public onBackspace(event): void {
    if (event.keyCode == 8) {
      this.numberOfSpaces = 0;
      if (!this.getSuperControl.value) {
        this.clearInput();
        this.waitValidation = false;
      }
    }
    if (this.activeAddress !== this.getSuperControl.value) {
      this.invalidAddress = true;
    }
  }

  public manipulateWithInput(event: KeyboardEvent): boolean {
    // Disable first character to be space
    if (
      !this.input.nativeElement.value &&
      /^[ ]*$/.test(String.fromCharCode(event.charCode))
    ) {
      event.preventDefault();
      return false;
    }

    if (['address'].includes(this.inputConfig.name.toLowerCase())) {
      if (/^[A-Za-z0-9 .&/,_-]*$/.test(String.fromCharCode(event.charCode))) {
        this.disableConsecutivelySpaces(event);
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }
  }

  public disableConsecutivelySpaces(event: any) {
    if (/^[ ]*$/.test(String.fromCharCode(event.charCode))) {
      this.numberOfSpaces++;
      if (this.numberOfSpaces > 1) {
        event.preventDefault();
        return false;
      }
    } else {
      this.numberOfSpaces = 0;
    }
  }

  ngOnDestroy(): void {}
}
