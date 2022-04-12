import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { pasteCheck } from 'src/assets/utils/methods-global';
import { ITaInput } from './ta-input.config';

@Component({
  selector: 'app-ta-input',
  templateUrl: './ta-input.component.html',
  styleUrls: ['./ta-input.component.scss'],
})
export class TaInputComponent implements ControlValueAccessor {
  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() inputConfig: ITaInput;

  @Output() dropdownEmitter: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  
  @Output() onClearInputEmitter: EventEmitter<boolean> =
  new EventEmitter<boolean>(); 

  public focusInput: boolean = false;
  public waitValidation: boolean = false;
  public togglePassword: boolean = false;
  public isVisiblePasswordEye: boolean = false;
  public isActiveDropdownOptions: boolean = false;
  public timeout = null;
  public numberOfSpaces: number = 0;

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

    if (this.inputConfig.type === 'password') {
      this.isVisiblePasswordEye = true;
    }

    // Dropdown Input
    if (this.inputConfig.dropdownArrow && !this.inputConfig.isDisabled) {
      this.isActiveDropdownOptions = true;
      this.dropdownEmitter.emit(this.isActiveDropdownOptions);
    }
  }

  public onBlur(): void {
    // Dropdown Input
    if (this.inputConfig.dropdownArrow && !this.inputConfig.isDisabled) {
      this.timeout = setTimeout(() => {
        this.isActiveDropdownOptions = false;
        this.dropdownEmitter.emit(this.isActiveDropdownOptions);
      }, 150);
    }

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
    if(this.inputConfig.dropdownArrow) {
      this.onClearInputEmitter.emit(true);
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
    if (['account name'].includes(this.inputConfig.name.toLowerCase())) {
      this.inputTypingPattern(event, true, false, true, false);
    }

    if (['username'].includes(this.inputConfig.name.toLowerCase())) {
      this.inputTypingPattern(event, true, true, false, false);
    }

    if (['email'].includes(this.inputConfig.name.toLowerCase())) {
      this.inputTypingPattern(event, true, true, false, true);
    }
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

  private inputTypingPattern(
    event: KeyboardEvent,
    characters: boolean,
    numbers: boolean,
    space: boolean,
    email: boolean
  ): void {
    if (characters && !numbers && space && !email) {
      this.inputWithSpaceTyping(event);
      this.inputCharactersTyping(event);
    }

    if (characters && numbers && !space && !email) {
      this.inputNoSpaceTyping(event);
      this.inputCharactersNumberTyping(event);
    }

    if (email) {
      this.inputNoSpaceTyping(event);
      this.inputEmailTyping(event);
    }
  }

  // Allow One Space Only
  private inputWithSpaceTyping(event: KeyboardEvent): void {
    let charCode = event.charCode;
    charCode === 32 ? this.numberOfSpaces++ : (this.numberOfSpaces = 0);
    if (this.numberOfSpaces >= 2) {
      event.preventDefault();
    }
  }

  // Disallow space
  private inputNoSpaceTyping(event: KeyboardEvent): void {
    let charCode = event.charCode;
    if (charCode === 32) {
      event.preventDefault();
    }
  }

  // Pattern 1: characters, space, backspace, point, dash
  public inputCharactersTyping(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (
      !(
        (charCode >= 97 && charCode <= 122) ||
        (charCode >= 65 && charCode <= 90) ||
        charCode === 32 ||
        charCode === 8 ||
        charCode === 46 ||
        charCode === 45
      )
    ) {
      event.preventDefault();
    }
  }

  // Pattern 2: characters, numbers, space, backspace, point, dash
  private inputCharactersNumberTyping(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (
      !(
        (charCode >= 97 && charCode <= 122) ||
        (charCode >= 65 && charCode <= 90) ||
        (charCode >= 48 && charCode <= 57) ||
        charCode === 46 ||
        charCode === 45
      )
    ) {
      event.preventDefault();
    }
  }

  // Pattern 3: characters, numbers, @, space, backspace, point, dash
  private inputEmailTyping(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (
      !(
        (charCode >= 97 && charCode <= 122) ||
        (charCode >= 65 && charCode <= 90) ||
        (charCode >= 48 && charCode <= 57) ||
        charCode === 46 ||
        charCode === 45 ||
        charCode === 64
      )
    ) {
      event.preventDefault();
    }
  }

  public onPaste(event: any, maxLength?: number) {
    event.preventDefault();

    const pasteText = event.clipboardData.getData('text');
    const limitCharacters = maxLength ? maxLength : 9999;
    let regex = /^[\n]*$/; // any character except new line

    if (['account name'].includes(this.inputConfig.name.toLowerCase())) {
      regex = /^[!@#$%^&*`()_+\=\[\]{};':"\\|,<>\/?0-9]*$/;
      this.input.nativeElement.value = pasteCheck(
        pasteText,
        regex,
        false,
        false,
        false,
        limitCharacters
      );
    } else if (['username'].includes(this.inputConfig.name.toLowerCase())) {
      regex = /^[!#$%^&*`()_+\=\[\]{};':"\\|,<>\/?]*$/;
      this.input.nativeElement.value = pasteCheck(
        pasteText,
        regex,
        false,
        false,
        false,
        limitCharacters
      );
    } else if (['url'].includes(this.inputConfig.name.toLowerCase())) {
      regex =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
      this.input.nativeElement.value = pasteCheck(
        pasteText,
        regex,
        false,
        false,
        false,
        limitCharacters
      );
    } else {
      this.input.nativeElement.value = pasteCheck(
        pasteText,
        regex,
        false,
        false,
        false,
        limitCharacters
      );
    }
    this.onChange(this.input.nativeElement.value);
  }

  public toggleDropdownOptions() {
    // if (this.inputConfig.dropdownArrow && !this.inputConfig.isDisabled) {
    //   this.isActiveDropdownOptions = !this.isActiveDropdownOptions;
    //   this.focusInput = !this.focusInput;
    //   if (this.isActiveDropdownOptions && this.focusInput) {
    //     this.setInputCursorAtTheEnd(this.input.nativeElement);
    //   }
    //   else {
    //     this.onBlur();
    //   }
    //   this.dropdownEmitter.emit(this.isActiveDropdownOptions);
    // }
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
