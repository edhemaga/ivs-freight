import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  Self,
  ViewChild,
} from '@angular/core';
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
  public togglePassword: boolean = false;
  public isVisiblePasswordEye: boolean = false;
  public timeout = null;
  public numberOfSpaces: number = 0;

  public patternNotAllowSpace: string = '/[ ]|^ /g';

  constructor(
    @Self() public superControl: NgControl,
    private changeDetection: ChangeDetectorRef
  ) {
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

  public onChange(event: any): void {}

  public onFocus(): void {
    // Skip valid focus in, if do not have value
    if (this.getSuperControl.value) {
      this.waitValidation = true;
    }
    this.focusInput = true;

    if (this.inputConfig.type === 'password') {
      this.isVisiblePasswordEye = true;
    }
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
    if (this.inputConfig.type === 'password') {
      this.timeout = setTimeout(() => {
        this.isVisiblePasswordEye = false;
        this.changeDetection.detectChanges();
      }, 150);
    }
  }

  public clearInput(): void {
    this.input.nativeElement.value = null;
    this.getSuperControl.setValue(null);
    this.numberOfSpaces = 0;
    if (this.inputConfig.isRequired && this.getSuperControl.errors) {
      this.waitValidation = true;
    } else {
      this.waitValidation = false;
    }
  }

  public manipulateWithInput(event: KeyboardEvent): void {
    // Check if backspace and empty value
    if (event.keyCode === 8) {
      this.numberOfSpaces = 0;
      if (!this.getSuperControl.value) {
        this.clearInput();
      }
    }

    // Check different user input typing
    if (['account name'].includes(this.inputConfig.name)) {
      this.onNameTyping(event);
    } else if (['email'].includes(this.inputConfig.name.toLowerCase())) {
      this.onEmailTyping(event);
    }
  }

  private onNameTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numberOfSpaces++;
    } else {
      this.numberOfSpaces = 0;
    }
    if (this.numberOfSpaces < 2) {
      return (
        (k > 64 && k < 91) ||
        (k > 96 && k <= 122) ||
        (k > 47 && k < 58) ||
        k == 8 ||
        k == 32 ||
        k == 46 ||
        k == 45
      );
    } else {
      event.preventDefault();
    }
  }

  private onEmailTyping(event) {
    let k;
    k = event.charCode;
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      (k >= 48 && k <= 57) ||
      k == 32 ||
      k == 64 ||
      k == 46 ||
      k == 45
    );
  }

  public getPlaceholderIcon(iconPlaceholder: string): string {
    if (!iconPlaceholder) {
      return null;
    }
    return `assets/svg/common/ic_${iconPlaceholder.toLowerCase()}.svg`;
  }

  public onTogglePassword(): void {
    this.togglePassword = !this.togglePassword;
    clearTimeout(this.timeout);
    this.setInputCursorAtTheEnd(this.input.nativeElement);
  }

  private setInputCursorAtTheEnd(input: any): void {
    const selectionEnd = input.selectionEnd;
    if (input.setSelectionRange) {
      input.setSelectionRange(selectionEnd, selectionEnd);
    }
    const timeout = setTimeout(() => {
      input.focus();
      clearTimeout(timeout);
    }, 200);
  }

  public getInputType(type: string): string {
    if (type === 'password') {
      if (this.togglePassword) {
        return 'text';
      } else {
        return 'password';
      }
    }
    return type;
  }
}


// Validate options checking
    // console.log('FOCUS OUT');
    // console.log('REQUIRED: ', this.inputConfig.isRequired);
    // console.log('VALUE: ', this.getSuperControl.value);
    // console.log('VALID: ', this.getSuperControl.valid);
    // console.log('INVALID: ', this.getSuperControl.invalid);
    // console.log('WAIT VALIDATION: ', this.waitValidation);
    // console.log('FOCUS: ', this.focusInput);
    // console.log('DISABLED: ', this.inputConfig.isDisabled);
    // console.log("PLACEHOLDER ICON: ", this.inputConfig.placeholderIcon)
    // console.log('VISIBLE PASSWORD EYE: ', this.isVisiblePasswordEye);