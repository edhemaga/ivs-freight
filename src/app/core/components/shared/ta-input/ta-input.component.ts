import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { debounceTime } from 'rxjs';
import { pasteCheck } from 'src/assets/utils/methods-global';
import { ITaInput } from './ta-input.config';
import { TaInputService } from './ta-input.service';

@Component({
  selector: 'app-ta-input',
  templateUrl: './ta-input.component.html',
  styleUrls: ['./ta-input.component.scss'],
})
export class TaInputComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() inputConfig: ITaInput;

  public focusInput: boolean = false;
  public waitValidation: boolean = false;
  public togglePassword: boolean = false;
  public isVisiblePasswordEye: boolean = false;
  public isActiveDropdownOptions: boolean = false;
  public activateDropdownAddNewMode: boolean = false;
  public isVisibleDropdownConfirmation: boolean = false;
  public timeout = null;
  public numberOfSpaces: number = 0;

  public counter = 0;

  constructor(
    @Self() public superControl: NgControl,
    private changeDetection: ChangeDetectorRef,
    private inputService: TaInputService
  ) {
    this.superControl.valueAccessor = this;
  }

  ngOnInit(): void {
    // DropDown
    if (this.inputConfig.dropdownArrow) {
      this.inputService.activateDropdownAddNewSubject
        .pipe(debounceTime(50), untilDestroyed(this))
        .subscribe((action) => {
          if (action) {
            this.activateDropdownAddNewMode = true;
            this.isVisibleDropdownConfirmation = true;
            this.focusInput = true;
            this.waitValidation = false;
            if (this.timeout) {
              clearTimeout(this.timeout);
            }
            this.setInputCursorAtTheEnd(this.input.nativeElement);
          } else {
            this.focusInput = false;
            this.activateDropdownAddNewMode = false;
            this.isVisibleDropdownConfirmation = false;
          }
        });
    }
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
      if (!this.activateDropdownAddNewMode) {
        this.inputService.dropDownShowHideSubject.next(
          this.isActiveDropdownOptions
        );
      }
    }
  }

  public onBlur(): void {
    // Dropdown Input
    if (this.inputConfig.dropdownArrow && !this.inputConfig.isDisabled) {
      this.timeout = setTimeout(() => {
        this.isActiveDropdownOptions = false;

        this.inputService.dropDownShowHideSubject.next(
          this.isActiveDropdownOptions
        );
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

    if (this.activateDropdownAddNewMode && this.inputConfig.dropdownArrow) {
      this.timeout = setTimeout(() => {
        this.isVisibleDropdownConfirmation = false;
        this.changeDetection.detectChanges();
      }, 150);
    }
  }

  public clearInput(): void {
    this.input.nativeElement.value = null;
    this.getSuperControl.setValue(null);
    this.numberOfSpaces = 0;

    this.inputConfig.isRequired && this.getSuperControl.errors
      ? (this.waitValidation = true)
      : (this.waitValidation = false);

    if (this.inputConfig.dropdownArrow) {
      this.inputService.onClearInputSubject.next(true);
      this.activateDropdownAddNewMode = false;
    }
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

  public manipulateWithInput(event: KeyboardEvent): void {
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
    if (this.inputConfig.dropdownArrow && !this.inputConfig.isDisabled) {
      this.isActiveDropdownOptions = !this.isActiveDropdownOptions;
      this.focusInput = !this.focusInput;
      if (this.isActiveDropdownOptions && this.focusInput) {
        this.setInputCursorAtTheEnd(this.input.nativeElement);
      } else {
        this.onBlur();
      }
      this.inputService.dropDownShowHideSubject.next(
        this.isActiveDropdownOptions
      );
    }
  }

  public onAddItemInDropdown() {
    this.inputService.addItemInDropdownSubject.next(true);
    clearTimeout(this.timeout);
  }

  ngOnDestroy(): void {}
}
