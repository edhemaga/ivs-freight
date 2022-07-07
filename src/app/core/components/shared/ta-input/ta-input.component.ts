import {
  AfterViewInit,
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
import { pasteCheck } from 'src/assets/utils/methods-global';
import { ITaInput } from './ta-input.config';
import { TaInputService } from './ta-input.service';
import { NgbDropdownConfig, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { CalendarScrollService } from '../custom-datetime-pickers/calendar-scroll.service';
import moment from 'moment';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import {
  convertNumberInThousandSep,
  convertThousanSepInNumber,
} from 'src/app/core/utils/methods.calculations';
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';
import { TaInputResetService } from './ta-input-reset.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-ta-input',
  templateUrl: './ta-input.component.html',
  styleUrls: ['./ta-input.component.scss'],
  providers: [
    NgbDropdownConfig,
    CalendarScrollService,
    TitleCasePipe,
    UpperCasePipe,
    TaThousandSeparatorPipe,
  ],
})
export class TaInputComponent
  implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor
{
  @ViewChild('input', { static: true }) public input: ElementRef;
  @ViewChild('span1', { static: false }) span1: ElementRef;
  @ViewChild('span2', { static: false }) span2: ElementRef;
  @ViewChild('span3', { static: false }) span3: ElementRef;
  @ViewChild('t2') t2: any;
  @ViewChild(NgbPopover)
  private ngbMainPopover: NgbPopover;

  @Input() inputConfig: ITaInput;

  @Output('change') changeInput: EventEmitter<any> = new EventEmitter<any>();
  @Output('commandEvent') inputCommandEvent: EventEmitter<any> =
    new EventEmitter<any>();

  public focusInput: boolean = false;
  public touchedInput: boolean = false;

  public togglePassword: boolean = false;
  public isVisiblePasswordEye: boolean = false;

  public showDateInput: boolean = false;
  public dateTimeInputDate: Date = new Date();

  public timeout = null;
  public numberOfSpaces: number = 0;

  // Dropdown
  public dropdownToggler: boolean = false;

  // Date Timer
  private dateTimeMainTimer: any;

  // Capslock input
  public capsLockOn: boolean = false;

  // Input Commands
  public isVisibleCommands: boolean = false;

  constructor(
    @Self() public superControl: NgControl,
    private inputService: TaInputService,
    private inputResetService: TaInputResetService,
    private calendarService: CalendarScrollService,
    private titlecasePipe: TitleCasePipe,
    private uppercasePipe: UpperCasePipe,
    private thousandSeparatorPipe: TaThousandSeparatorPipe
  ) {
    this.superControl.valueAccessor = this;
  }

  ngAfterViewInit() {
    if (
      this.inputConfig.name === 'datepicker' ||
      this.inputConfig.name === 'timepicker'
    ) {
      if (this.getSuperControl.value) {
        this.setTimeDateInput(this.getSuperControl.value);
      }
    }
  }

  ngOnInit(): void {
    if (
      this.inputConfig.name === 'datepicker' ||
      this.inputConfig.name === 'timepicker'
    ) {
      this.calendarService.dateChanged
        .pipe(untilDestroyed(this))
        .subscribe((date) => {
          this.setTimeDateInput(date);
          this.t2.close();
        });
    }

    // Dropdown add mode
    if (this.inputConfig.isDropdown && !this.inputConfig.isDisabled) {
      this.inputService.dropdownAddModeSubject$
        .pipe(untilDestroyed(this))
        .subscribe((action) => {
          if (action) {
            this.dropdownToggler = false;

            this.setInputCursorAtTheEnd(this.input.nativeElement);
          }
        });

      // Dropdown select item with enter
      this.inputService.dropDownItemSelectedOnEnter$
        .pipe(untilDestroyed(this))
        .subscribe((action) => {
          if (action) {
            this.dropdownToggler = false;
            this.input.nativeElement.blur();
            this.blurOnDropDownArrow();
          }
        });
    }

    // Auto Focus First Input
    if (this.inputConfig.autoFocus && !this.getSuperControl.value) {
      const timeout = setTimeout(() => {
        this.onFocus();
        this.input.nativeElement.focus();
        clearTimeout(timeout);
      }, 300);
    }

    // Reset Inputs
    this.inputResetService.resetInputSubject
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.touchedInput = false;
          this.getSuperControl.patchValue(null);
          this.inputResetService.resetInputSubject.next(false);

          this.resetDateTimeInputs();
        }
      });
  }

  public setTimeDateInput(date) {
    let text, dateFormat, timeFormat;
    if (this.inputConfig.name === 'datepicker') {
      text = moment(new Date(date)).format('MM/DD/YY');
      dateFormat = text.split('/');
    } else {
      text = moment(new Date(date)).format('HH:mm');
      timeFormat = moment(new Date(date)).format('hh/mm/A');
      dateFormat = timeFormat.split('/');
    }

    this.input.nativeElement.value = text;
    this.onChange(this.input.nativeElement.value);
    this.focusInput = false;

    this.span1.nativeElement.innerHTML = dateFormat[0];
    this.span2.nativeElement.innerHTML = dateFormat[1];
    this.span3.nativeElement.innerHTML = dateFormat[2];
    this.dateTimeInputDate = new Date(date);
    this.showDateInput = true;
  }

  get getSuperControl() {
    return this.superControl.control;
  }

  public writeValue(obj: any): void {
    this.input.nativeElement.value = obj;
    this.changeInput.emit(this.input.nativeElement.value);
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
    // Password
    if (this.inputConfig.type === 'password') {
      this.isVisiblePasswordEye = true;
    }

    // Input Commands
    if (this.inputConfig.commands?.active) {
      this.isVisibleCommands = true;
    }

    // Datepicker
    if (
      this.inputConfig.name === 'datepicker' ||
      this.inputConfig.name === 'timepicker'
    ) {
      clearTimeout(this.dateTimeMainTimer);

      this.showDateInput = true;
      this.span1.nativeElement.focus();
      this.selectionInput = 0;
      this.setSpanSelection(this.span1.nativeElement);
    }

    // Dropdown
    if (this.inputConfig.isDropdown) {
      this.dropdownToggler = true;
      this.inputService.dropDownShowHide$.next(true);
    }

    this.focusInput = true;
  }

  public onBlur(): void {
    // Dropdown
    if (this.inputConfig.isDropdown) {
      if (
        this.inputConfig.name === 'datepicker' ||
        this.inputConfig.name === 'timepicker'
      ) {
        // Datepicker
        if (this.inputConfig.name === 'datepicker') {
          if (!this.getSuperControl.value) {
            this.inputConfig.type = 'text';
            this.blurOnDateTime();
          }
        } else if (this.inputConfig.name === 'timepicker') {
          if (!this.getSuperControl.value) {
            this.inputConfig.type = 'text';
            this.blurOnDateTime();
          }
        } else {
          this.focusInput = false;
        }
      } else {
        this.blurOnDropDownArrow();
      }
    } else {
      let selection = window.getSelection();
      selection.removeAllRanges();

      // Password
      if (this.inputConfig.type === 'password') {
        this.blurOnPassword();
      }

      // Input Commands
      if (this.inputConfig.commands?.active) {
        this.blurOnCommands();
      }

      this.focusInput = false;
    }

    this.inputService.onFocusOutInput$.next(true);
    this.touchedInput = true;
  }

  private blurOnPassword() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.isVisiblePasswordEye = false;
      clearTimeout(this.timeout);
    }, 150);
  }

  private blurOnCommands() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.isVisibleCommands = false;
      clearTimeout(this.timeout);
    }, 150);
  }

  private blurOnDropDownArrow() {
    this.timeout = setTimeout(() => {
      this.dropdownToggler = false;
      this.focusInput = false;
      this.inputService.dropDownShowHide$.next(false);
      clearTimeout(this.timeout);
    }, 150);
  }

  public clearInput(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.input.nativeElement.value = null;
    this.getSuperControl.setValue(null);
    this.numberOfSpaces = 0;
    this.touchedInput = true;

    if (['datepicker', 'timepicker'].includes(this.inputConfig.name)) {
      this.resetDateTimeInputs();
    }

    this.inputService.onClearInput$.next(true);
  }

  public resetDateTimeInputs() {
    if (this.inputConfig.name === 'datepicker') {
      this.span1.nativeElement.innerHTML = 'mm';
      this.span2.nativeElement.innerHTML = 'dd';
      this.span3.nativeElement.innerHTML = 'yy';
    } else if (this.inputConfig.name === 'timepicker') {
      this.span1.nativeElement.innerHTML = 'HH';
      this.span2.nativeElement.innerHTML = 'MM';
      this.span3.nativeElement.innerHTML = 'AM';
    }

    this.focusInput = false;
    this.showDateInput = false;
  }

  public toggleDropdownOptions() {
    this.dropdownToggler = !this.dropdownToggler;

    this.inputService.dropDownShowHide$.next(this.dropdownToggler);

    if (this.dropdownToggler) {
      clearTimeout(this.timeout);
      this.input.nativeElement.focus();
      this.focusInput = true;
    }
    if (
      this.inputConfig.name === 'datepicker' ||
      this.inputConfig.name === 'timepicker'
    ) {
      if (this.t2) {
        this.t2.open();
      }
    }
  }

  public onTogglePassword(): void {
    this.togglePassword = !this.togglePassword;
    clearTimeout(this.timeout);
    this.setInputCursorAtTheEnd(this.input.nativeElement);
  }

  public setInputCursorAtTheEnd(input: any, time: number = 120): void {
    const selectionEnd = input.selectionEnd;
    if (input.setSelectionRange) {
      input.setSelectionRange(selectionEnd, selectionEnd);
    }
    const timeout = setTimeout(() => {
      input.focus();
      clearTimeout(timeout);
    }, time);
  }

  public onKeyUp(event): void {
    if (event.keyCode == 8 && !this.inputConfig.isDropdown) {
      this.numberOfSpaces = 0;

      if (!this.input.nativeElement.value) {
        this.clearInput(event);
      }
    }

    if (this.inputConfig.isDropdown) {
      if (event.keyCode === 40 || event.keyCode === 38) {
        this.inputService.dropDownKeyNavigation$.next(event.keyCode);
      }
      if (event.keyCode === 13) {
        this.inputService.dropDownKeyNavigation$.next(event.keyCode);
      }
      if (event.keyCode === 27) {
        this.blurOnDropDownArrow();
        this.input.nativeElement.blur();
      }
      if (event.keyCode === 9) {
        this.onFocus();
        this.input.nativeElement.focus();
        this.inputService.dropDownKeyNavigation$.next(event.keyCode);
      }
    }

    if (event.getModifierState('CapsLock')) {
      this.capsLockOn = true;
    } else {
      this.capsLockOn = false;
    }
  }

  public transformText(event: any) {
    switch (this.inputConfig.textTransform) {
      case 'capitalize': {
        this.input.nativeElement.value = this.titleCaseInput(event);
        break;
      }
      case 'uppercase': {
        this.input.nativeElement.value = this.upperCaseInput(event);
        break;
      }
      default: {
        break;
      }
    }

    if (this.inputConfig.thousandSeparator && this.getSuperControl.value) {
      this.getSuperControl.patchValue(
        this.thousandSeparatorPipe.transform(this.getSuperControl.value)
      );
    }
  }

  public onCommands(event: Event, type: string, action: string) {
    event.stopPropagation();
    event.preventDefault();
    switch (type) {
      case 'pm-increment-decrement': {
        const value = convertThousanSepInNumber(this.getSuperControl.value);
        switch (action) {
          case 'decrement': {
            if (value >= 10000 && value < 20000) {
              this.getSuperControl.patchValue(
                convertNumberInThousandSep(value - 1000)
              );
            } else if (value >= 20001 && value < 50000) {
              this.getSuperControl.patchValue(
                convertNumberInThousandSep(value - 3000)
              );
            } else if (value >= 50001 && value < 100000) {
              this.getSuperControl.patchValue(
                convertNumberInThousandSep(value - 5000)
              );
            } else if (value >= 10000) {
              this.getSuperControl.patchValue(
                convertNumberInThousandSep(value - 10000)
              );
            } else {
              this.getSuperControl.patchValue(
                convertNumberInThousandSep(value - 500)
              );
            }
            break;
          }
          case 'increment': {
            if (value > 10000 && value < 20000) {
              this.getSuperControl.patchValue(
                convertNumberInThousandSep(value + 1000)
              );
            } else if (value >= 20001 && value < 50000) {
              this.getSuperControl.patchValue(
                convertNumberInThousandSep(value + 3000)
              );
            } else if (value >= 50001 && value < 100000) {
              this.getSuperControl.patchValue(
                convertNumberInThousandSep(value + 5000)
              );
            } else if (value >= 10000) {
              this.getSuperControl.patchValue(
                convertNumberInThousandSep(value + 10000)
              );
            } else {
              this.getSuperControl.patchValue(
                convertNumberInThousandSep(value + 500)
              );
            }
            break;
          }
          default: {
            break;
          }
        }
        clearTimeout(this.timeout);
        this.setInputCursorAtTheEnd(this.input.nativeElement);
        break;
      }
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

  public titleCaseInput(value: string) {
    return this.titlecasePipe.transform(value);
  }

  public upperCaseInput(value: string) {
    return this.uppercasePipe.transform(value);
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

    if (['account name'].includes(this.inputConfig.name.toLowerCase())) {
      if (/^[A-Za-z .,&'()-]*$/.test(String.fromCharCode(event.charCode))) {
        this.disableConsecutivelySpaces(event);
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    if (['username'].includes(this.inputConfig.name.toLowerCase())) {
      if (/^[A-Za-z0-9.,&'()-]*$/.test(String.fromCharCode(event.charCode))) {
        this.disableConsecutivelySpaces(event);
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    if (['file name'].includes(this.inputConfig.name.toLowerCase())) {
      if (/^[:*?"<>|/]*$/.test(String.fromCharCode(event.charCode))) {
        event.preventDefault();
        return false;
      } else {
        this.disableConsecutivelySpaces(event);
        return true;
      }
    }

    if (
      [
        'first name',
        'last name',
        'name',
        'full name',
        'relationship',
        'title',
        'description',
      ].includes(this.inputConfig.name.toLowerCase())
    ) {
      let spaces = this.input.nativeElement.value.split(' ').length;
      if (
        /^[A-Za-z ]*$/.test(String.fromCharCode(event.charCode)) &&
        spaces <= 2
      ) {
        this.disableConsecutivelySpaces(event);
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    if (['insurance policy'].includes(this.inputConfig.name.toLowerCase())) {
      if (/^[A-Za-z0-9-]*$/.test(String.fromCharCode(event.charCode))) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    if (
      ['address unit', 'truck number', 'trailer number'].includes(
        this.inputConfig.name.toLowerCase()
      )
    ) {
      if (/^[A-Za-z0-9 ]*$/.test(String.fromCharCode(event.charCode))) {
        this.disableConsecutivelySpaces(event);
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    if (
      [
        'routing number',
        'account number',
        'empty mile',
        'loaded mile',
        'per stop',
        'empty weight',
        'axles',
        'base rate',
        'mileage',
        'ipas ezpass',
        'credit limit',
        'phone extension',
        'qty',
        'price',
        'odometer',
      ].includes(this.inputConfig.name.toLowerCase())
    ) {
      if (/^[0-9]*$/.test(String.fromCharCode(event.charCode))) {
        this.disableConsecutivelySpaces(event);
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    if (['year'].includes(this.inputConfig.name.toLowerCase())) {
      if (
        /^[0]*$/.test(String.fromCharCode(event.charCode)) &&
        !this.input.nativeElement.value
      ) {
        event.preventDefault();
        return false;
      }

      if (/^[0-9]$/.test(String.fromCharCode(event.charCode))) {
        this.disableConsecutivelySpaces(event);
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    if (['email'].includes(this.inputConfig.name.toLowerCase())) {
      if (/^[A-Za-z0-9.@-_]*$/.test(String.fromCharCode(event.charCode))) {
        this.disableConsecutivelySpaces(event);
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    if (['bussines name'].includes(this.inputConfig.name.toLowerCase())) {
      if (
        /^[A-Za-z0-9 .,$@#*&%-]*$/.test(String.fromCharCode(event.charCode))
      ) {
        this.disableConsecutivelySpaces(event);
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    if (['dba name'].includes(this.inputConfig.name.toLowerCase())) {
      if (/^[A-Za-z0-9 .,$@&-]*$/.test(String.fromCharCode(event.charCode))) {
        this.disableConsecutivelySpaces(event);
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    if (['mc ff'].includes(this.inputConfig.name.toLowerCase())) {
      if (/^[A-Za-z0-9 ,.&-]*$/.test(String.fromCharCode(event.charCode))) {
        this.disableConsecutivelySpaces(event);
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    if (['po box'].includes(this.inputConfig.name.toLowerCase())) {
      if (/^[A-Za-z0-9 .]*$/.test(String.fromCharCode(event.charCode))) {
        this.disableConsecutivelySpaces(event);
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    if (['vin'].includes(this.inputConfig.name.toLowerCase())) {
      if (/^[A-Za-z0-9]*$/.test(String.fromCharCode(event.charCode))) {
        this.disableConsecutivelySpaces(event);
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    if (['model'].includes(this.inputConfig.name.toLowerCase())) {
      if (/^[A-Za-z0-9 -]*$/.test(String.fromCharCode(event.charCode))) {
        this.disableConsecutivelySpaces(event);
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    if (
      ['full parking slot', 'parking slot'].includes(
        this.inputConfig.name.toLowerCase()
      )
    ) {
      if (/^[0-9,-]*$/.test(String.fromCharCode(event.charCode))) {
        this.disableConsecutivelySpaces(event);
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }

    this.input.nativeElement.value.trimEnd();
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

  public onDatePaste(e: any) {
    e.preventDefault();
    const pasteText = e.clipboardData.getData('text');
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

  // OVAJ DEO OVDE JE ZA CUSTOM DATEPICKERS

  scrollTypes: any = {
    pmAmScroll: 0,
    minutesScroll: 0,
    hourScroll: 8,
    monthScroll: 0,
    dayScroll: 0,
    yearScroll: 0,
  };

  selectionInput: number = -1;
  setSelection(e) {
    e.preventDefault();
    e.stopPropagation();
    const element = e.target;
    this.focusInput = true;
    this.selectionInput = parseInt(element.getAttribute('tabindex'));

    clearTimeout(this.dateTimeMainTimer);
    if (element.classList.contains('main')) {
      this.setSpanSelection(element);
    } else {
      // var selObj = window.getSelection();
      // var selRange = selObj.getRangeAt(0);
      this.span1.nativeElement.focus();
      this.selectionInput = 0;
      this.setSpanSelection(this.span1.nativeElement);
    }
  }

  setSpanSelection(element) {
    var range, selection;

    if (window.getSelection && document.createRange) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  showDateTimePlaceholder() {
    this.showDateInput = true;
    this.focusInput = true;
    this.selectionInput = 0;
    this.span1.nativeElement.focus();
    this.setSpanSelection(this.span1.nativeElement);
  }

  changeSelection(e): void {
    e.preventDefault();
    e.stopPropagation();

    if (
      e.keyCode == 37 ||
      e.keyCode == 38 ||
      e.keyCode == 39 ||
      e.keyCode == 40 ||
      e.keyCode == 8 ||
      e.keyCode == 9 ||
      e.keyCode == 46 ||
      (this.selectionInput == 3 && this.inputConfig.name === 'timepicker')
    ) {
      !e.noPrevent && e.preventDefault();
      if (e.keyCode == 37) {
        if (this.selectionInput != 0) {
          this.selectionInput = this.selectionInput - 1;
          this.selectSpanByTabIndex(this.selectionInput);
        }
      } else if (e.keyCode == 39 || e.keyCode == 9) {
        if (this.selectionInput != 2 && !e.shiftKey) {
          this.selectionInput = this.selectionInput + 1;
          this.selectSpanByTabIndex(this.selectionInput);
        } else if (e.keyCode == 9 && !e.shiftKey) {
          let allInputs = document.querySelectorAll('input');
          [...(allInputs as any)].map((item, indx) => {
            if (item === this.input.nativeElement) {
              allInputs[indx + 1].focus();
              return;
            }
          });
        } else if (e.shiftKey && e.keyCode == 9 && this.selectionInput != 0) {
          this.selectionInput = this.selectionInput - 1;
          this.selectSpanByTabIndex(this.selectionInput);
        } else {
          let allInputs = document.querySelectorAll('input');
          [...(allInputs as any)].map((item, indx) => {
            if (item === this.input.nativeElement) {
              allInputs[indx - 1].focus();
              return;
            }
          });
        }
      } else if (e.keyCode == 38) {
        this.setDateTimeModel('up');
      } else if (e.keyCode == 40) {
        this.setDateTimeModel('down');
      }
    } else if (!this.isNumber(e)) {
      e.preventDefault();
    } else {
      e.preventDefault();
      this.handleKeyboardInputs(e);
    }
  }

  handleKeyboardInputs(e: KeyboardEvent) {
    const span1Value = isNaN(this.span1.nativeElement.innerHTML)
      ? undefined
      : parseInt(this.span1.nativeElement.innerHTML);
    const span2Value = isNaN(this.span2.nativeElement.innerHTML)
      ? undefined
      : parseInt(this.span2.nativeElement.innerHTML);
    const span3Value = isNaN(this.span3.nativeElement.innerHTML)
      ? ''
      : parseInt(this.span3.nativeElement.innerHTML);
    if (this.inputConfig.name === 'datepicker') {
      if (this.selectionInput == 0) {
        if (span1Value) {
          if (parseInt(`${span1Value}${e.key}`) > 12) {
            this.span2.nativeElement.innerHTML = ('0' + parseInt(e.key)).slice(
              -2
            );
            this.selectionInput = 1;
            this.selectSpanByTabIndex(1);
          } else {
            this.dateTimeInputDate = new Date(
              this.dateTimeInputDate.setMonth(
                parseInt(
                  this.span1.nativeElement.innerHTML + (parseInt(e.key) - 1)
                )
              )
            );
            this.span1.nativeElement.innerHTML = (
              this.span1.nativeElement.innerHTML + parseInt(e.key)
            ).slice(-2);
            this.selectionInput = 1;
            this.selectSpanByTabIndex(1);
          }
        } else {
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setMonth(parseInt(e.key) - 1)
          );

          this.span1.nativeElement.innerHTML = ('0' + parseInt(e.key)).slice(
            -2
          );

          if (parseInt(`1${e.key}`) > 12) {
            this.selectionInput = 1;
            this.selectSpanByTabIndex(1);
          } else {
            this.selectSpanByTabIndex(0);
          }
        }
      } else if (this.selectionInput == 1) {
        if (span2Value) {
          if (parseInt(`${span2Value}${e.key}`) > 31) {
            this.span3.nativeElement.innerHTML = ('0' + parseInt(e.key)).slice(
              -2
            );
            this.selectionInput = 2;
            this.selectSpanByTabIndex(2);
          } else {
            this.dateTimeInputDate = new Date(
              this.dateTimeInputDate.setDate(
                parseInt(this.span2.nativeElement.innerHTML + parseInt(e.key))
              )
            );
            this.span2.nativeElement.innerHTML = (
              this.span2.nativeElement.innerHTML + parseInt(e.key)
            ).slice(-2);
            this.selectionInput = 3;
            this.selectSpanByTabIndex(3);
          }
        } else {
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setDate(parseInt(e.key))
          );
          this.span2.nativeElement.innerHTML = ('0' + parseInt(e.key)).slice(
            -2
          );

          if (parseInt(`1${e.key}`) > 31) {
            this.selectionInput = 3;
            this.selectSpanByTabIndex(3);
          } else {
            this.selectSpanByTabIndex(1);
          }
        }
      } else {
        if (!span3Value || span3Value.toString().length == 2) {
          this.span3.nativeElement.innerHTML = ('0' + parseInt(e.key)).slice(
            -2
          );
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setFullYear(
              parseInt(`200${parseInt(e.key)}`)
            )
          );

          this.selectSpanByTabIndex(3);
        } else {
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setFullYear(
              parseInt(
                `2${this.span3.nativeElement.innerHTML + parseInt(e.key)}`
              )
            )
          );
          this.span3.nativeElement.innerHTML = (
            this.span3.nativeElement.innerHTML + parseInt(e.key)
          ).slice(-2);
          this.selectSpanByTabIndex(3);
        }
      }
    } else {
    }
  }

  selectSpanByTabIndex(indx) {
    switch (indx) {
      case 0:
        this.setSpanSelection(this.span1.nativeElement);
        break;
      case 1:
        this.setSpanSelection(this.span2.nativeElement);
        break;
      default:
        this.setSpanSelection(this.span3.nativeElement);
    }
  }

  setDateTimeModel(direction: string) {
    if (this.inputConfig.name === 'datepicker') {
      if (direction == 'up') {
        if (this.selectionInput == 0) {
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setMonth(
              this.dateTimeInputDate.getMonth() + 1
            )
          );
          this.span1.nativeElement.innerHTML = (
            '0' +
            (this.dateTimeInputDate.getMonth() + 1)
          ).slice(-2);
          this.setSpanSelection(this.span1.nativeElement);
        } else if (this.selectionInput == 1) {
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setDate(this.dateTimeInputDate.getDate() + 1)
          );
          this.span2.nativeElement.innerHTML = (
            '0' + this.dateTimeInputDate.getDate()
          ).slice(-2);
          this.setSpanSelection(this.span2.nativeElement);
        } else {
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setFullYear(
              this.dateTimeInputDate.getFullYear() + 1
            )
          );
          this.span3.nativeElement.innerHTML = this.dateTimeInputDate
            .getFullYear()
            .toString()
            .slice(-2);
          this.setSpanSelection(this.span3.nativeElement);
        }
      } else {
        if (this.selectionInput == 0) {
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setMonth(
              this.dateTimeInputDate.getMonth() + 1
            )
          );
          this.span1.nativeElement.innerHTML = (
            '0' +
            (this.dateTimeInputDate.getMonth() + 1)
          ).slice(-2);
          this.setSpanSelection(this.span1.nativeElement);
        } else if (this.selectionInput == 1) {
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setDate(this.dateTimeInputDate.getDate() + 1)
          );
          this.span2.nativeElement.innerHTML = (
            '0' + this.dateTimeInputDate.getDate()
          ).slice(-2);
          this.setSpanSelection(this.span2.nativeElement);
        } else {
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setFullYear(
              this.dateTimeInputDate.getFullYear() - 1
            )
          );
          this.span3.nativeElement.innerHTML = this.dateTimeInputDate
            .getFullYear()
            .toString()
            .slice(-2);
          this.setSpanSelection(this.span3.nativeElement);
        }
      }
    } else {
      if (direction == 'up') {
        if (this.selectionInput == 0) {
          const selectedHours = this.dateTimeInputDate.getHours() + 1;
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setHours(selectedHours)
          );
          this.span1.nativeElement.innerHTML = (
            '0' + (selectedHours > 12 ? selectedHours - 12 : selectedHours)
          ).slice(-2);
          this.setSpanSelection(this.span1.nativeElement);

          if (selectedHours > 11 && selectedHours < 24) {
            this.span3.nativeElement.innerHTML = 'PM';
          } else {
            this.span3.nativeElement.innerHTML = 'AM';
          }
        } else if (this.selectionInput == 1) {
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setMinutes(
              this.dateTimeInputDate.getMinutes() + 1
            )
          );
          this.span2.nativeElement.innerHTML = (
            '0' + this.dateTimeInputDate.getMinutes()
          ).slice(-2);
          this.setSpanSelection(this.span2.nativeElement);
        } else {
          this.span3.nativeElement.innerHTML =
            this.span3.nativeElement.innerHTML == 'AM' ? 'PM' : 'AM';
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setHours(
              this.span3.nativeElement.innerHTML == 'AM'
                ? this.dateTimeInputDate.getHours() % 12
                : this.dateTimeInputDate.getHours() + 12
            )
          );
          this.setSpanSelection(this.span3.nativeElement);
        }
      } else {
        if (this.selectionInput == 0) {
          const decreaseHour = this.dateTimeInputDate.getHours() - 1;

          let selectedHours = decreaseHour === 0 ? 24 : decreaseHour;
          selectedHours = decreaseHour === -1 ? 23 : selectedHours;
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setHours(selectedHours)
          );

          this.span1.nativeElement.innerHTML = (
            '0' + (selectedHours > 12 ? selectedHours - 12 : selectedHours)
          ).slice(-2);
          this.setSpanSelection(this.span1.nativeElement);
          if (selectedHours > 11 && selectedHours < 24) {
            this.span3.nativeElement.innerHTML = 'PM';
          } else {
            this.span3.nativeElement.innerHTML = 'AM';
          }
        } else if (this.selectionInput == 1) {
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setMinutes(
              this.dateTimeInputDate.getMinutes() - 1
            )
          );
          this.span2.nativeElement.innerHTML = (
            '0' + this.dateTimeInputDate.getMinutes()
          ).slice(-2);
          this.setSpanSelection(this.span2.nativeElement);
        } else {
          this.span3.nativeElement.innerHTML =
            this.span3.nativeElement.innerHTML == 'AM' ? 'PM' : 'AM';
          this.dateTimeInputDate = new Date(
            this.dateTimeInputDate.setHours(
              this.span3.nativeElement.innerHTML == 'AM'
                ? this.dateTimeInputDate.getHours() % 12
                : this.dateTimeInputDate.getHours() + 12
            )
          );
          this.setSpanSelection(this.span3.nativeElement);
        }
      }
    }
  }

  isNumber(evt) {
    evt = evt ? evt : window.event;
    let charCode = evt.which ? evt.which : evt.keyCode;
    return (
      (charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105)
    );
  }

  onPopoverShown() {
    this.focusInput = true;
    this.showDateInput = true;
  }

  onPopoverHidden() {
    this.focusInput = false;
    this.blurOnDateTime();
  }

  closePopover() {
    if (this.ngbMainPopover) {
      this.ngbMainPopover.close();
    }
  }

  private blurOnDateTime() {
    clearTimeout(this.dateTimeMainTimer);
    this.dateTimeMainTimer = setTimeout(() => {
      if (this.inputConfig.name === 'datepicker') {
        if (
          !isNaN(this.span1.nativeElement.innerHTML) &&
          !isNaN(this.span2.nativeElement.innerHTML) &&
          !isNaN(this.span3.nativeElement.innerHTML)
        ) {
          this.calendarService.dateChanged.next(this.dateTimeInputDate);
        } else {
          this.span1.nativeElement.innerHTML = 'mm';
          this.span2.nativeElement.innerHTML = 'dd';
          this.span3.nativeElement.innerHTML = 'yy';
          this.showDateInput = false;
          this.dateTimeInputDate = new Date();
        }
      } else {
        if (
          !isNaN(this.span1.nativeElement.innerHTML) &&
          !isNaN(this.span2.nativeElement.innerHTML)
        ) {
          this.calendarService.dateChanged.next(this.dateTimeInputDate);
        } else {
          this.span1.nativeElement.innerHTML = 'HH';
          this.span2.nativeElement.innerHTML = 'MM';
          this.showDateInput = false;
          this.dateTimeInputDate = new Date();
        }
      }
      clearTimeout(this.dateTimeMainTimer);
      this.focusInput = false;
    }, 100);
  }
}
