import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Self,
  ViewChild,
  ViewEncapsulation,
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

@Component({
  selector: 'app-ta-input',
  templateUrl: './ta-input.component.html',
  styleUrls: ['./ta-input.component.scss'],
  providers: [
    NgbDropdownConfig,
    CalendarScrollService,
    TitleCasePipe,
    UpperCasePipe,
  ]
})
export class TaInputComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @ViewChild('input', { static: true }) public input: ElementRef;
  @ViewChild('span1', { static: false }) span1: ElementRef;
  @ViewChild('span2', { static: false }) span2: ElementRef;
  @ViewChild('span3', { static: false }) span3: ElementRef;
  @Input() inputConfig: ITaInput;
  @ViewChild('t2') t2: any;

  @Output('change') changeInput: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(NgbPopover)
  private ngbMainPopover: NgbPopover;

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
  public isDropdownAddModeActive: boolean = false;

  // Date Timer
  private dateTimeMainTimer: any;

  constructor(
    @Self() public superControl: NgControl,
    private changeDetection: ChangeDetectorRef,
    private inputService: TaInputService,
    private calendarService: CalendarScrollService,
    private titlecasePipe: TitleCasePipe,
    private uppercasePipe: UpperCasePipe
  ) {
    this.superControl.valueAccessor = this;
  }

  ngOnInit(): void {
    if (this.inputConfig.name === 'datepicker' || this.inputConfig.name === 'timepicker') {
      this.calendarService.dateChanged
        .pipe(untilDestroyed(this))
        .subscribe((date) => {
          let text, dateFormat, timeFormat;
          if( this.inputConfig.name === 'datepicker' ){
            text = moment(new Date(date)).format('MM/DD/YY');
            dateFormat = text.split('/');
            
          }else{
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
          this.t2.close();
        });
    }

    if (this.inputConfig.isDropdown && !this.inputConfig.isDisabled) {
      this.inputService.dropdownAddModeSubject
        .pipe(untilDestroyed(this))
        .subscribe((action) => {
          console.log('Input ADD MODE ', action);
          if (action) {
            this.dropdownToggler = false;
            this.isDropdownAddModeActive = action;
            this.focusInput = true;
            this.setInputCursorAtTheEnd(this.input.nativeElement);
          }
        });

      this.inputService.isDropDownItemSelectedOnEnter
        .pipe(untilDestroyed(this))
        .subscribe((action) => {
          console.log('Input SELECT WITH ENTER ', action);
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
    if (this.inputConfig.isDropdown && !this.isDropdownAddModeActive) {
      this.dropdownToggler = true;
      this.inputService.dropDownShowHideSubject.next(true);
    }

    this.focusInput = true;
  }

  public onBlur(): void {
    // Dropdown
    if (this.inputConfig.isDropdown) {
      this.blurOnDropDownArrow();
    } else {
      this.focusInput = false;

      let selection = window.getSelection();
      selection.removeAllRanges();

      // Password
      if (this.inputConfig.type === 'password') {
        this.blurOnPassword();
      }

      // Datepicker
      if (this.inputConfig.name === 'datepicker') {
        if (!this.getSuperControl.value) {
          this.inputConfig.type = 'text';
          this.blurOnDateTime();
        }
      }

      if (this.inputConfig.name === 'timepicker') {
        if (!this.getSuperControl.value) {
          this.inputConfig.type = 'text';
          this.blurOnDateTime();
        }
      }
    }
    this.inputService.onFocusOutInputSubject.next(true);
    this.touchedInput = true;
  }

  private blurOnPassword() {
    this.timeout = setTimeout(() => {
      this.isVisiblePasswordEye = false;
      this.changeDetection.detectChanges();
    }, 150);
  }

  private blurOnDropDownArrow() {
    this.timeout = setTimeout(() => {
      this.dropdownToggler = false;
      this.focusInput = false;
      this.inputService.dropDownShowHideSubject.next(false);
      clearTimeout(this.timeout);
    }, 150);
  }

  public clearInput(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.input.nativeElement.value = null;
    this.getSuperControl.setValue(null);
    this.numberOfSpaces = 0;
    this.isDropdownAddModeActive = false;
    this.touchedInput = true;

    if (this.inputConfig.name === 'datepicker') {
      this.focusInput = false;
      this.showDateInput = false;
      this.span1.nativeElement.innerHTML = 'mm';
      this.span2.nativeElement.innerHTML = 'dd';
      this.span3.nativeElement.innerHTML = 'yy';
    }

    if (this.inputConfig.name === 'timepicker') {
      this.focusInput = false;
      this.showDateInput = false; 
      this.span1.nativeElement.innerHTML = 'HH';
      this.span2.nativeElement.innerHTML = 'MM';
      this.span3.nativeElement.innerHTML = 'AM';
    }



    this.inputService.onClearInputSubject.next(true);
  }

  public onAddItemInDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDropdownAddModeActive = false;
    this.inputService.addDropdownItemSubject.next(true);
  }

  public toggleDropdownOptions() {
    this.dropdownToggler = !this.dropdownToggler;

    this.inputService.dropDownShowHideSubject.next(this.dropdownToggler);

    if (this.dropdownToggler) {
      clearTimeout(this.timeout);
      this.input.nativeElement.focus();
      this.focusInput = true;
    }
  }

  public onTogglePassword(): void {
    this.togglePassword = !this.togglePassword;
    clearTimeout(this.timeout);
    this.setInputCursorAtTheEnd(this.input.nativeElement);
  }

  public setInputCursorAtTheEnd(input: any): void {
    const selectionEnd = input.selectionEnd;
    if (input.setSelectionRange) {
      input.setSelectionRange(selectionEnd, selectionEnd);
    }
    const timeout = setTimeout(() => {
      input.focus();
      clearTimeout(timeout);
    }, 150);
  }

  public onKeyUp(event): void {
    if (event.keyCode == 8 && !this.inputConfig.isDropdown) {
      this.numberOfSpaces = 0;
      if (!this.input.nativeElement.value) {
        this.clearInput(event);
      }
    }
    console.log(event.keyCode)
    if (this.inputConfig.isDropdown) {
      if (event.keyCode === 40 || event.keyCode === 38) {
        this.inputService.dropDownNavigatorSubject.next(event.keyCode);
      }
      if (event.keyCode === 13) {
        this.inputService.dropDownNavigatorSubject.next(event.keyCode);
      }
      if (event.keyCode === 27) {
        this.blurOnDropDownArrow();
        this.input.nativeElement.blur();
      }
      if (event.keyCode === 9) {
        this.onFocus();
        this.input.nativeElement.focus();
        this.inputService.dropDownNavigatorSubject.next(event.keyCode);
      }
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
        'mileage',
        'ipas ezpass',
        'credit limit',
        'phone extension',
        'qty',
        'price',
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

    console.log('NEXT ONEEEEE');
    console.log(e.keyCode);

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
        if (this.selectionInput != 2) {
          this.selectionInput = this.selectionInput + 1;
          this.selectSpanByTabIndex(this.selectionInput);
        } else if (e.keyCode == 9) {
          console.log('final third click');
          this.input.nativeElement.focus();
          setTimeout(() => {
            this.input.nativeElement.dispatchEvent(new KeyboardEvent('keydown',{'keyCode': 9}));
          }, 500);
          
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
      //this.handleKeyboardInputs(e);
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
    }
  }

  isNumber(evt) {
    evt = evt ? evt : window.event;
    let charCode = evt.which ? evt.which : evt.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
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
      console.log('SELECTED DATE PICKER');
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
        }
      }
      clearTimeout(this.dateTimeMainTimer);
    }, 100);
  }
}
