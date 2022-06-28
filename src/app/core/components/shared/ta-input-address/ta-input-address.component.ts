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
import { AddressEntity } from 'appcoretruckassist';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { ITaInput } from '../ta-input/ta-input.config';

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

  @Output() selectedAddress: EventEmitter<{
    address: AddressEntity;
    valid: boolean;
  }> = new EventEmitter<{ address: AddressEntity; valid: boolean }>(null);
  @Output('commandEvent') inputCommandEvent: EventEmitter<any> =
    new EventEmitter<any>();

  public focusInput: boolean = false;
  public touchedInput: boolean = false;

  public numberOfSpaces: number = 0;

  public activeAddress: AddressEntity;
  public invalidAddress: boolean = false;

  public options = {
    componentRestrictions: { country: ['US', 'CA'] },
  };

  // Input Commands
  public isVisibleCommands: boolean = false;

  public timeout: any = null;

  constructor(
    @Self() public superControl: NgControl,
    private sharedService: SharedService
  ) {
    this.superControl.valueAccessor = this;
  }

  ngOnInit(): void {}

  public handleAddressChange(address: AddressEntity) {
    this.activeAddress = this.sharedService.selectAddress(null, address);
    this.invalidAddress = false;
    this.selectedAddress.emit({ address: this.activeAddress, valid: true });
    this.getSuperControl.setValue(this.activeAddress.address);
    this.getSuperControl.setErrors(null);
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

  public onChange(event: any): void {}

  public registerOnTouched(fn: any): void {}

  public setDisabledState?(isDisabled: boolean): void {
    this.inputConfig.isDisabled = isDisabled;
  }

  public onFocus(): void {
    this.focusInput = true;

    if (!this.activeAddress) {
      this.invalidAddress = true;
      this.getSuperControl.setErrors({ invalid: true });
      this.selectedAddress.emit({ address: null, valid: false });
    }

    // Input Commands
    if (this.inputConfig.commands?.active) {
      this.isVisibleCommands = true;
    }
  }

  public onBlur(): void {
    this.focusInput = false;
    this.touchedInput = true;

    if (!this.getSuperControl.value && this.inputConfig.isRequired) {
      this.getSuperControl.setErrors({ required: true });
    }

    // Input Commands
    if (this.inputConfig.commands?.active) {
      this.blurOnCommands();
    }
  }

  private blurOnCommands() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.isVisibleCommands = false;
      clearTimeout(this.timeout);
    }, 150);

    console.log(this.inputConfig.commands);
    console.log(this.focusInput);
    console.log(this.isVisibleCommands);
  }

  public clearInput(): void {
    this.input.nativeElement.value = null;
    this.getSuperControl.setValue(null);
    this.numberOfSpaces = 0;
    this.touchedInput = true;
    this.activeAddress = null;
    this.invalidAddress = false;
    this.getSuperControl.setErrors(null);

    if (!this.inputConfig.isRequired) {
      this.selectedAddress.emit({ address: null, valid: true });
      this.getSuperControl.setErrors(null);
    } else {
      this.selectedAddress.emit({ address: null, valid: false });
      this.invalidAddress = true;
      this.getSuperControl.setErrors({ required: true });
    }
  }

  public onBackspace(event): void {
    if (event.keyCode == 8) {
      this.numberOfSpaces = 0;
      if (!this.input.nativeElement.value) {
        this.clearInput();
      }
    }
    if (this.activeAddress?.address !== this.getSuperControl.value) {
      this.invalidAddress = true;
      this.getSuperControl.setErrors({ invalid: true });
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

  public onCommands(event: Event, type: string, action: string) {
    event.stopPropagation();
    event.preventDefault();
    switch (type) {
      case 'confirm-cancel': {
        switch (action) {
          case 'confirm': {
            this.inputCommandEvent.emit('confirm');
            break;
          }
          case 'cancel': {
            this.inputCommandEvent.emit('cancel');
            break;
          }
          default: {
            break;
          }
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {}
}
