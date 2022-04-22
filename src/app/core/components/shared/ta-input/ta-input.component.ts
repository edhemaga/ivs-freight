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
import { pasteCheck } from 'src/assets/utils/methods-global';
import { ITaInput } from './ta-input.config';
import { TaInputService } from './ta-input.service';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { CalendarScrollService } from '../custom-datetime-pickers/calendar-scroll.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-ta-input',
  templateUrl: './ta-input.component.html',
  styleUrls: ['./ta-input.component.scss'],
  providers: [NgbDropdownConfig],
})
export class TaInputComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @ViewChild('input', { static: true }) input: ElementRef;
  @Input() inputConfig: ITaInput;
  @ViewChild('t2') t2: any;

  public focusInput: boolean = false;
  public waitValidation: boolean = false;
  public togglePassword: boolean = false;
  public isVisiblePasswordEye: boolean = false;

  public timeout = null;
  public numberOfSpaces: number = 0;

  // Dropdown
  public isDropdownOptionsActive: boolean = false;
  public isDropdownAddModeActive: boolean = false;

  constructor(
    @Self() public superControl: NgControl,
    private changeDetection: ChangeDetectorRef,
    private inputService: TaInputService,
    private calendarService: CalendarScrollService,
    private datePipe: DatePipe
  ) {
    this.superControl.valueAccessor = this;
  }

  ngOnInit(): void {
    this.calendarService.dateChanged.subscribe((date) => {
      if(this.inputConfig.name === "datepicker") {
        const text = moment(new Date(date)).format('YYYY-MM-DD');
        this.input.nativeElement.value = text;
        this.onChange(this.input.nativeElement.value);
        this.inputConfig.type = 'date';
        this.t2.close();
      }
    });

    if (this.inputConfig.isDropdown && !this.inputConfig.isDisabled) {
      this.inputService.dropdownAddModeSubject
        .pipe(untilDestroyed(this))
        .subscribe((action) => {
          if (action) {
            this.isDropdownOptionsActive = false;
            this.isDropdownAddModeActive = action;
            clearTimeout(this.timeout);
            this.focusInput = true;
            this.setInputCursorAtTheEnd(this.input.nativeElement);
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

    // Password
    if (this.inputConfig.type === 'password') {
      this.isVisiblePasswordEye = true;
    }

    if(this.inputConfig.name === "datepicker") {
      this.inputConfig.type = 'date';
    }

    // Dropdown
    if (this.inputConfig.isDropdown && !this.isDropdownAddModeActive) {
      this.inputService.dropDownShowHideSubject.next(true);
      this.isDropdownOptionsActive = true;
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

    // Password
    if (this.inputConfig.type === 'password') {
      this.timeout = setTimeout(() => {
        this.isVisiblePasswordEye = false;
        this.changeDetection.detectChanges();
      }, 150);
    }

    // Dropdown
    if (this.inputConfig.isDropdown) {
      if (!this.isDropdownAddModeActive) {
        this.timeout = setTimeout(() => {
          this.inputService.dropDownShowHideSubject.next(false);
          this.isDropdownOptionsActive = false;
          this.changeDetection.detectChanges();
        }, 150);
      } else {
        this.timeout = setTimeout(() => {
          this.isDropdownAddModeActive = false;
          this.inputService.dropDownShowHideSubject.next(false);
          this.changeDetection.detectChanges();
        }, 250);
      }
    }

    if(this.inputConfig.name === "datepicker") {
      if(!this.getSuperControl.value && this.getSuperControl.invalid){
        this.inputConfig.type = 'text';
      }
    }
  }

  public clearInput(): void {
    this.input.nativeElement.value = null;
    this.getSuperControl.setValue(null);
    this.numberOfSpaces = 0;
    this.isDropdownAddModeActive = false;

    this.inputConfig.isRequired && this.getSuperControl.errors
      ? (this.waitValidation = true)
      : (this.waitValidation = false);

    if(this.inputConfig.name === "datepicker") {
      this.inputConfig.type = 'text';
    }

    this.inputService.onClearInputSubject.next(true);
  }

  public onAddItemInDropdown() {
    this.isDropdownAddModeActive = false;
    this.inputService.addDropdownItemSubject.next(true);
  }

  public toggleDropdownOptions() {
    this.isDropdownOptionsActive = !this.isDropdownOptionsActive;

    this.inputService.dropDownShowHideSubject.next(
      this.isDropdownOptionsActive
    );

    if (this.isDropdownOptionsActive) {
      clearTimeout(this.timeout);
      this.input.nativeElement.focus();
      this.focusInput = true;
    }
  }

  public getPlaceholderIcon(iconPlaceholder: string): string {
    return this.inputService.getPlaceholderIcon(iconPlaceholder);
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
    }, 150);
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
      this.inputTypingPattern(event, true, false, true, false, true);
    }

    if (['username'].includes(this.inputConfig.name.toLowerCase())) {
      this.inputTypingPattern(event, true, true, false, false, true);
    }

    if (
      ['first name', 'last name', 'name', 'relationship'].includes(
        this.inputConfig.name.toLowerCase()
      )
    ) {
      this.inputTypingPattern(event, true, false, true);
    }

    if (['address unit'].includes(this.inputConfig.name.toLowerCase())) {
      this.inputTypingPattern(event, true, true, true);
    }

    if (['bussines name'].includes(this.inputConfig.name.toLowerCase())) {
      this.inputTypingPattern(event, true, true, true, false, true, true);
    }

    if (
      [
        'routing number',
        'account number',
        'empty mile',
        'loaded mile',
        'per stop',
      ].includes(this.inputConfig.name.toLowerCase())
    ) {
      this.inputTypingPattern(event, false, true, false);
    }

    if (['email'].includes(this.inputConfig.name.toLowerCase())) {
      this.inputTypingPattern(event, false, false, false, true);
    }
  }

  private inputTypingPattern(
    event: KeyboardEvent,
    characters: boolean,
    numbers: boolean,
    space: boolean,
    email?: boolean,
    pointDash?: boolean,
    specialCharacters?: boolean
  ): void {
    if (
      characters &&
      !numbers &&
      space &&
      !email &&
      pointDash &&
      !specialCharacters
    ) {
      this.inputCharactersTyping(event);
      this.inputWithSpaceTyping(event);
      this.inputPointDash(event);
    }

    if (
      characters &&
      numbers &&
      !space &&
      !email &&
      pointDash &&
      !specialCharacters
    ) {
      this.inputCharactersTyping(event);
      this.inputNumbersTyping(event);
      this.inputPointDash(event);
    }

    if (
      characters &&
      !numbers &&
      space &&
      !email &&
      !pointDash &&
      !specialCharacters
    ) {
      this.inputCharactersTyping(event);
      this.inputWithSpaceTyping(event);
    }

    if (
      characters &&
      numbers &&
      space &&
      !email &&
      !pointDash &&
      !specialCharacters
    ) {
      this.inputCharactersTyping(event);
      this.inputNumbersTyping(event);
      this.inputWithSpaceTyping(event);
    }

    if (
      characters &&
      numbers &&
      space &&
      !email &&
      pointDash &&
      specialCharacters
    ) {
      this.inputCharactersTyping(event);
      this.inputNumbersTyping(event);
      this.inputWithSpaceTyping(event);
      this.inputPointDash(event);
      this.inputSpecialCharacters(event);
    }

    if (
      !characters &&
      numbers &&
      !space &&
      !email &&
      !pointDash &&
      !specialCharacters
    ) {
      this.inputNumbersTyping(event);
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

  // Pattern 1: characters, space, backspace
  public inputCharactersTyping(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (
      !(
        (charCode >= 97 && charCode <= 122) ||
        (charCode >= 65 && charCode <= 90) ||
        charCode === 32 ||
        charCode === 8
      )
    ) {
      event.preventDefault();
    }
  }

  // Pattern 2: numbers
  public inputNumbersTyping(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (!(charCode >= 48 && charCode <= 57)) {
      event.preventDefault();
    }
  }

  // Pattern 3: point, dash
  public inputPointDash(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (!(charCode === 46 || charCode === 45)) {
      event.preventDefault();
    }
  }

  // Pattern 4: point, dash, comma, &, ', ()
  public inputSpecialCharacters(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (
      !(
        charCode === 46 ||
        charCode === 45 ||
        charCode === 44 ||
        charCode === 38 ||
        charCode === 39 ||
        charCode === 40 ||
        charCode === 41
      )
    )
      event.preventDefault();
  }

  // Pattern 6: EMAIL (characters, numbers, @, space, backspace, point, dash)
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

  ngOnDestroy(): void {}
}
