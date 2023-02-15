import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Self,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ITaInput } from './ta-input.config';
import { TaInputService } from './ta-input.service';
import { NgbDropdownConfig, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { CalendarScrollService } from '../custom-datetime-pickers/calendar-scroll.service';
import moment from 'moment';

import { TaInputResetService } from './ta-input-reset.service';
import { Subject, takeUntil } from 'rxjs';
import { TaThousandSeparatorPipe } from '../../../pipes/taThousandSeparator.pipe';
import {
    convertThousanSepInNumber,
    convertNumberInThousandSep,
} from '../../../utils/methods.calculations';
import { FormService } from 'src/app/core/services/form/form.service';
import { ImageBase64Service } from '../../../utils/base64.image';
import { NotificationService } from '../../../services/notification/notification.service';
@Component({
    selector: 'app-ta-input',
    templateUrl: './ta-input.component.html',
    styleUrls: ['./ta-input.component.scss'],
    providers: [
        NgbDropdownConfig,
        CalendarScrollService,
        TaThousandSeparatorPipe,
    ],
    encapsulation: ViewEncapsulation.None,
})
export class TaInputComponent
    implements OnInit, OnChanges, OnDestroy, ControlValueAccessor
{
    private destroy$ = new Subject<void>();

    @ViewChild('input', { static: true }) public input: ElementRef;
    @ViewChild('span1', { static: false }) span1: ElementRef;
    @ViewChild('span2', { static: false }) span2: ElementRef;
    @ViewChild('span3', { static: false }) span3: ElementRef;
    @ViewChild('holder1', { static: false }) holder1: ElementRef;
    @ViewChild('t2') t2: any;
    @ViewChild(NgbPopover) ngbMainPopover: NgbPopover;

    @Input() inputConfig: ITaInput;
    @Input() incorrectValue: boolean;
    @Input() selectedDropdownLabelColor: any;

    @Output('incorrectEvent') incorrectInput: EventEmitter<any> =
        new EventEmitter<any>();

    @Output('blurInput') blurInput: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    @Output('focusInput') focusInputEvent: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    @Output('change') changeInput: EventEmitter<any> = new EventEmitter<any>();
    @Output('commandEvent') commandEvent: EventEmitter<any> =
        new EventEmitter<any>();

    @Output('clear') clearInputEvent: EventEmitter<boolean> =
        new EventEmitter<any>();

    public focusInput: boolean = false;
    public touchedInput: boolean = false;

    public togglePassword: boolean = false;

    public showDateInput: boolean = false;

    public newInputChanged: boolean = false;

    public dateTimeInputDate: Date = new Date();

    // Number of spaces
    public numberOfConsecutivelySpaces: number = 0;
    public oneSpaceOnlyCounter: number = 0;
    public lastCursorSpacePosition: number = 0;

    // Number of points
    public numberOfConsecutivelyPoints: number = 0;
    public numberOfPoints: number = 0;

    // Dropdown
    public dropdownToggler: boolean = false;

    // Date Timer
    private dateTimeMainTimer: any;
    private preventBlur: boolean = false;

    // Capslock input
    public capsLockOn: boolean = false;

    // Input Commands
    public isVisibleCommands: boolean = false;
    // Edit Input
    public editInputMode: boolean = false;

    // Input Selection
    public inputSelection: boolean = false;

    public focusBlur: any;

    // Price Separator
    public cursorInputPosition: number;
    public hasDecimalIndex: number = -1;
    public originPriceSeparatorLimit: number;
    public isDotDeleted: boolean = false;

    public wholeInputSelection: any;

    // Timeout
    public timeoutCleaner: any = null;

    constructor(
        @Self() public superControl: NgControl,
        private inputService: TaInputService,
        private inputResetService: TaInputResetService,
        private calendarService: CalendarScrollService,
        private thousandSeparatorPipe: TaThousandSeparatorPipe,
        private refChange: ChangeDetectorRef,
        private formService: FormService,
        public imageBase64Service: ImageBase64Service,
        private notificationService: NotificationService
    ) {
        this.superControl.valueAccessor = this;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.inputConfig?.currentValue?.multipleInputValues?.options) {
            this.inputConfig.multipleInputValues.options =
                changes.inputConfig.currentValue?.multipleInputValues?.options;
        }
    }

    setTimePickerTime() {
        if (this.inputConfig.name === 'timepicker')
            this.dateTimeInputDate = new Date(
                moment().format('MM/DD/YYYY') +
                    (this.inputConfig?.isFromDate ? ' 12:15' : ' 12:00')
            );
    }

    ngOnInit(): void {
        // Toggle label transition animation
        $('.input-label').addClass('no-transition');

        this.timeoutCleaner = setTimeout(() => {
            $('.input-label').removeClass('no-transition');
        }, 1000);

        if (this.inputConfig.priceSeparator) {
            this.originPriceSeparatorLimit =
                this.inputConfig.priceSeparatorLimitation;
        }

        // DatePicker
        if (
            this.inputConfig.name === 'datepicker' ||
            this.inputConfig.name === 'timepicker'
        ) {
            this.setTimePickerTime();
            this.calendarService.dateChanged
                .pipe(takeUntil(this.destroy$))
                .subscribe((date) => {
                    if (!this.inputConfig.isDisabled) {
                        this.setTimeDateInput(date);
                        this.t2.close();
                    }
                });
        }

        // Dropdown add mode
        if (
            (this.inputConfig.isDropdown || this.inputConfig.dropdownLabel) &&
            !this.inputConfig.isDisabled
        ) {
            this.inputService.dropDownAddMode$
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    (data: { action: boolean; inputConfig: ITaInput }) => {
                        if (data.action) {
                            this.dropdownToggler = false;

                            this.timeoutCleaner = setTimeout(() => {
                                this.inputConfig = data.inputConfig;
                                this.setInputCursorAtTheEnd(
                                    this.input.nativeElement
                                );
                                this.isVisibleCommands = true;
                            }, 300);
                        }
                    }
                );

            // Dropdown select item with enter
            this.inputService.dropDownItemSelectedOnEnter$
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                    (data: { action: boolean; inputConfig: ITaInput }) => {
                        if (data.action) {
                            this.dropdownToggler = false;
                            this.focusInput = false;
                            this.input.nativeElement.blur();
                        }
                    }
                );
        }

        // Auto Focus First Input
        if (this.inputConfig.autoFocus && !this.getSuperControl.value) {
            this.timeoutCleaner = setTimeout(() => {
                if (
                    this.inputConfig.name !== 'datepicker' &&
                    this.inputConfig.name !== 'timepicker'
                ) {
                    this.onFocus();
                }

                this.input.nativeElement.focus();
            }, 0);
        }

        // Reset Inputs
        this.inputResetService.resetInputSubject
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.resetForms();
                }
            });

        // Reset Form
        this.formService.formReset$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.touchedInput = false;
                    this.formService.formReset$.next(false);
                    this.resetDateTimeInputs();
                }
            });
    }

    resetForms() {
        this.touchedInput = false;
        this.getSuperControl.patchValue(null);
        this.inputResetService.resetInputSubject.next(false);

        this.resetDateTimeInputs();
    }

    public setTimeDateInput(date) {
        let text, dateFormat, timeFormat;
        if (this.inputConfig.name === 'datepicker') {
            text = moment(new Date(date)).format('MM/DD/YY');
            dateFormat = text.split('/');
        } else {
            date =
                date instanceof Date
                    ? date
                    : new Date(moment().format('MM/DD/YYYY') + ' ' + date);
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
        this.changeInput.emit(obj);
        if (
            this.inputConfig.name === 'datepicker' ||
            this.inputConfig.name === 'timepicker'
        ) {
            if (obj) {
                this.timeoutCleaner = setTimeout(() => {
                    this.setTimeDateInput(obj);
                }, 300);
            } else {
                this.input.nativeElement.value = obj;
                this.resetDateTimeInputs();
            }
        } else {
            this.input.nativeElement.value = obj;
        }
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public onChange(_: any): void {}

    public registerOnTouched(_: any): void {}

    public setDisabledState?(isDisabled: boolean): void {
        this.inputConfig.isDisabled = isDisabled;
    }

    public onFocus(e?): void {
        this.focusInputEvent.emit(true);

        // Input Commands
        if (this.inputConfig.commands?.active) {
            this.isVisibleCommands = true;
        }

        // DropDown Label
        if (this.inputConfig.dropdownLabel) {
            this.inputConfig.placeholderIcon = 'ic_dynamic_focus_label.svg';
        }

        // Datepicker
        if (
            (this.inputConfig.name === 'datepicker' ||
                this.inputConfig.name === 'timepicker') &&
            !this.inputConfig.isDisabled
        ) {
            clearTimeout(this.dateTimeMainTimer);
            clearTimeout(this.focusBlur);
            this.showDateInput = true;
            if (
                (this.selectionInput == -1 &&
                    e?.target?.nodeName === 'INPUT') ||
                e?.relatedTarget?.nodeName === 'INPUT' ||
                e?.relatedTarget == null
            ) {
                this.preventBlur = true;
                this.holder1.nativeElement.focus();
                this.setSpanSelection(this.holder1.nativeElement);
                this.selectionInput = -1;
            }

            this.t2.close();
        }

        // Dropdown
        if (this.inputConfig.isDropdown) {
            this.dropdownToggler = true;
            this.inputService.dropDownShowHide$.next(true);
        }

        this.focusInput = true;
    }

    public onBlur(e?): void {
        // DropDown Label
        if (this.inputConfig.dropdownLabel && !this.editInputMode) {
            this.inputConfig.placeholderIcon = 'ic_dynamic_label.svg';
        }

        // Edit Input
        if (this.editInputMode) {
            this.getSuperControl.setErrors({ invalid: true });
            return;
        }

        // // Datepicker
        if (this.preventBlur) {
            this.preventBlur = false;
            return;
        }

        // Price Separator - remove dot on focus out
        if (
            this.inputConfig.priceSeparator &&
            this.getSuperControl?.value?.indexOf('.') >= 0
        ) {
            // 4.1. Check for Dot position
            this.hasDecimalIndex = this.getSuperControl.value.indexOf('.');

            let integerPart = this.thousandSeparatorPipe.transform(
                this.getSuperControl.value
                    .slice(0, this.hasDecimalIndex)
                    .slice(0, this.inputConfig.priceSeparatorLimitation)
            );

            let decimalPart = this.getSuperControl.value.slice(
                this.hasDecimalIndex + 1
            );

            // 4.4. Get only two numbers of decimal part
            decimalPart = decimalPart.slice(0, 2);

            if (!decimalPart) {
                this.hasDecimalIndex = -1;
                this.getSuperControl.patchValue(integerPart);
                this.numberOfPoints = 0;
            }
        }

        // Dropdown
        if (this.inputConfig.isDropdown || this.inputConfig.dropdownLabel) {
            if (
                (this.inputConfig.name === 'datepicker' ||
                    this.inputConfig.name === 'timepicker') &&
                !this.inputConfig.isDisabled
            ) {
                if (e?.target?.nodeName === 'INPUT') {
                    return;
                }
                // Datepicker
                if (
                    this.inputConfig.name === 'datepicker' ||
                    this.inputConfig.name === 'timepicker'
                ) {
                    this.focusBlur = setTimeout(() => {
                        this.blurOnDateTime();
                    }, 100);
                } else {
                    this.focusInput = false;
                }
            } else {
                this.blurOnDropDownArrow();
            }
        } else {
            let selection = window.getSelection();
            selection.removeAllRanges();

            // Input Commands
            if (this.inputConfig.commands?.active) {
                this.blurOnCommands();
            }

            this.focusInput = false;
        }

        this.blurInput.emit(true);

        this.inputService.onFocusOutInput$.next(true);
        this.touchedInput = true;
    }

    private blurOnCommands() {
        this.timeoutCleaner = setTimeout(() => {
            this.isVisibleCommands = false;
        }, 150);
    }

    private blurOnDropDownArrow() {
        this.timeoutCleaner = setTimeout(() => {
            this.dropdownToggler = false;
            this.focusInput = false;
            this.inputService.dropDownShowHide$.next(false);
        }, 150);
    }

    public clearInput(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        // Clear whole input
        if (this.inputConfig.removeInput) {
            this.clearInputEvent.emit(true);
            return;
        }
        // Clear value
        if (this.inputConfig.incorrectInput) {
            this.incorrectValue = !this.incorrectValue;
            this.incorrectInput.emit(this.incorrectValue);
        } else {
            this.input.nativeElement.value = null;
            this.getSuperControl.setValue(null);
            this.numberOfConsecutivelySpaces = 0;
            this.numberOfConsecutivelyPoints = 0;
            this.numberOfPoints = 0;
            this.oneSpaceOnlyCounter = 0;
            this.inputConfig.dropdownImageInput = null;
            this.touchedInput = true;
            this.focusInput = false;
            if (['datepicker', 'timepicker'].includes(this.inputConfig.name)) {
                this.resetDateTimeInputs();
            }

            this.inputService.onClearInput$.next(true);
            this.clearInputEvent.emit(true);
        }
    }

    public resetDateTimeInputs() {
        if (this.span1) {
            if (this.inputConfig.name === 'datepicker') {
                this.span1.nativeElement.innerHTML = 'mm';
                this.span2.nativeElement.innerHTML = 'dd';
                this.span3.nativeElement.innerHTML = 'yy';
            } else if (this.inputConfig.name === 'timepicker') {
                this.span1.nativeElement.innerHTML = 'HH';
                this.span2.nativeElement.innerHTML = 'MM';
                this.span3.nativeElement.innerHTML = 'AM';
            }
        }

        this.setTimePickerTime();
        this.newInputChanged = true;
        this.focusInput = false;
        this.showDateInput = false;
    }

    public toggleDropdownOptions() {
        if (this.inputConfig.isDisabled) {
            return;
        }

        if (
            (this.inputConfig.name === 'datepicker' ||
                this.inputConfig.name === 'timepicker') &&
            !this.inputConfig.isDisabled
        ) {
            if (this.t2) {
                if (!this.t2.isOpen()) {
                    clearTimeout(this.dateTimeMainTimer);
                    clearTimeout(this.focusBlur);
                    this.holder1.nativeElement.focus();
                    this.selectionInput = -1;
                    this.setSpanSelection(this.holder1.nativeElement);
                    this.t2.open();
                } else {
                    this.holder1.nativeElement.blur();
                    this.focusInput = false;
                    let selection = window.getSelection();
                    selection.removeAllRanges();
                }
                return;
            }
        }

        this.dropdownToggler = !this.dropdownToggler;

        this.inputService.dropDownShowHide$.next(this.dropdownToggler);

        if (this.dropdownToggler) {
            this.input.nativeElement.focus();
            this.focusInput = true;
        }
    }

    public onTogglePassword(event: any): void {
        event.preventDefault();
        event.stopPropagation();

        this.togglePassword = !this.togglePassword;
    }

    public setInputCursorAtTheEnd(input: any, time: number = 120): void {
        const selectionEnd = input.selectionEnd;
        if (input.setSelectionRange) {
            input.setSelectionRange(selectionEnd, selectionEnd);
        }
        this.timeoutCleaner = setTimeout(() => {
            input.focus();
        }, time);
    }

    public onKeydown(event) {
        if (event) {
            this.capsLockOn =
                event?.getModifierState('CapsLock') || event?.shiftKey;
        }

        if (this.inputConfig.priceSeparator) {
            this.isDotDeleted = this.getSuperControl?.value?.includes('.');
        }

        // Disable for phone field first character to be 0
        if (this.inputConfig.name.toLowerCase() === 'phone') {
            if (event.target.selectionStart === 0 && event.key === '0') {
                event.preventDefault();
            }
        }

        if (event.keyCode === 9) {
            this.inputService.dropDownKeyNavigation$.next({
                keyCode: event.keyCode,
                data: null,
            });
        }
    }

    public onKeyup(event): void {
        // Reset function property for disabling multiple dots
        if (this.isDotDeleted && !this.getSuperControl?.value?.includes('.')) {
            this.numberOfPoints = 0;
        }
        if (
            event.keyCode == 8 &&
            !(this.inputConfig.isDropdown || this.inputConfig.dropdownLabel)
        ) {
            // Reset Multiple Consecutively Spaces
            this.numberOfConsecutivelySpaces = 0;

            // Reset One Space Only
            if (!this.getSuperControl.value?.includes(' ')) {
                this.oneSpaceOnlyCounter = 0;
            }

            if (!this.input.nativeElement.value) {
                this.clearInput(event);
            }
        }

        if (
            this.inputConfig.isDropdown ||
            this.inputConfig.dropdownLabel ||
            this.inputConfig.name == 'Address'
        ) {
            if (event.keyCode === 40 || event.keyCode === 38) {
                this.inputService.dropDownKeyNavigation$.next({
                    keyCode: event.keyCode,
                    data: null,
                });
            }
            if (event.keyCode === 13) {
                this.inputService.dropDownKeyNavigation$.next({
                    keyCode: event.keyCode,
                    data: this.inputConfig,
                });

                if (this.inputConfig.name == 'Address') {
                    this.input.nativeElement.blur();
                }
            }
            if (event.keyCode === 27) {
                this.isVisibleCommands = false;
                this.onBlur();
                this.blurOnDropDownArrow();
                this.input.nativeElement.blur();
                this.inputService.dropDownKeyNavigation$.next({
                    keyCode: event.keyCode,
                    data: null,
                });
            }
            if (event.keyCode === 9) {
                this.onFocus();
                this.input.nativeElement.focus();
                this.inputService.dropDownKeyNavigation$.next({
                    keyCode: event.keyCode,
                    data: null,
                });
            }
        }
    }

    public transformText(value?: string, paste?: boolean) {
        this.cursorInputPosition = this.input.nativeElement.selectionStart;

        if (paste) {
            if (!this.inputSelection) {
                this.input.nativeElement.value += value;

                if (
                    this.input.nativeElement.value.length >
                    this.inputConfig.maxLength
                ) {
                    this.input.nativeElement.value =
                        this.input.nativeElement.value.substring(
                            0,
                            this.inputConfig.maxLength
                        );
                }
            } else {
                this.input.nativeElement.value = value;
                this.inputSelection = false;
            }

            // Delete spaces on begin and end
            this.input.nativeElement.value =
                this.input.nativeElement.value.trim();
            this.getSuperControl.patchValue(this.input.nativeElement.value);
        }
        // not paste
        else {
            if (value) {
                this.input.nativeElement.value = value;
            }
        }

        switch (this.inputConfig.textTransform) {
            case 'capitalize': {
                this.input.nativeElement.value =
                    this.input.nativeElement.value.charAt(0)?.toUpperCase() +
                    this.input.nativeElement.value.substring(1).toLowerCase();
                this.getSuperControl.patchValue(this.input.nativeElement.value);
                break;
            }
            case 'uppercase': {
                this.input.nativeElement.value =
                    this.input.nativeElement.value.toLocaleUpperCase('en-US');
                this.getSuperControl.patchValue(this.input.nativeElement.value);
                break;
            }
            default: {
                this.getSuperControl.patchValue(this.input.nativeElement.value);
                break;
            }
        }

        if (this.inputConfig.thousandSeparator && this.getSuperControl.value) {
            if (
                this.getSuperControl.value
                    .toString()
                    .split('')
                    .every((value) => {
                        return value === '0';
                    }) &&
                this.getSuperControl.value.split('').length > 0
            ) {
                this.getSuperControl.patchValue('0');
                return;
            }

            if (this.getSuperControl.value.toString())
                this.getSuperControl.patchValue(
                    this.thousandSeparatorPipe.transform(
                        this.getSuperControl.value
                    )
                );
        }

        if (this.inputConfig.priceSeparator && this.getSuperControl.value) {
            // 0. Don't allow 0 as first character
            if (
                this.getSuperControl.value
                    .toString()
                    .split('')
                    .every((value) => {
                        return value === '0';
                    }) &&
                this.getSuperControl.value.split('').length > 0
            ) {
                this.getSuperControl.patchValue('0');
                return;
            }

            // 4. If user set dot
            if (this.getSuperControl.value.indexOf('.') >= 0) {
                // 4.1. Check for Dot position
                this.hasDecimalIndex = this.getSuperControl.value.indexOf('.');

                this.originPriceSeparatorLimit =
                    this.inputConfig.priceSeparatorLimitation + 3;

                // 4.2. Divide number on decimal and integer part
                let integerPart = this.thousandSeparatorPipe.transform(
                    this.getSuperControl.value
                        .slice(0, this.hasDecimalIndex)
                        .slice(0, this.inputConfig.priceSeparatorLimitation)
                );

                let decimalPart = this.getSuperControl.value.slice(
                    this.hasDecimalIndex + 1
                );

                if (!integerPart) {
                    integerPart = '0';
                }

                // 4.4. Get only two numbers of decimal part
                decimalPart = decimalPart.slice(0, 2);

                if (decimalPart) {
                    // 4.5. Set formatted number
                    this.getSuperControl.patchValue(
                        integerPart + '.' + decimalPart
                    );
                    this.hasDecimalIndex =
                        this.getSuperControl.value.indexOf('.');
                }
            }
            // 5. If user doesn't set dot
            else {
                this.hasDecimalIndex = -1;

                if (this.getSuperControl.value.indexOf('.') === -1) {
                    // Transform value with thousand separator
                    this.getSuperControl.patchValue(
                        this.thousandSeparatorPipe.transform(
                            this.getSuperControl.value
                        )
                    );

                    // Limit validation
                    this.originPriceSeparatorLimit =
                        this.inputConfig.priceSeparatorLimitation;

                    // Cut value
                    this.getSuperControl.patchValue(
                        this.getSuperControl.value.slice(
                            0,
                            this.inputConfig.priceSeparatorLimitation
                        )
                    );

                    // Transform value again after cutting
                    this.getSuperControl.patchValue(
                        this.thousandSeparatorPipe.transform(
                            this.getSuperControl.value
                        )
                    );
                }
            }

            this.timeoutCleaner = setTimeout(() => {
                this.input.nativeElement.setSelectionRange(
                    this.cursorInputPosition +
                        (this.getSuperControl.value.indexOf('.') === -1
                            ? 1
                            : 0),
                    this.cursorInputPosition +
                        (this.getSuperControl.value.indexOf('.') === -1 ? 1 : 0)
                );
            }, 0);
        }

        /**
         *  Custom Validation For This Type of Input Below, DONT TOUCH !
         */

        if (['year'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                parseInt(value) >
                parseInt(moment().add(1, 'year').format('YYYY'))
            ) {
                this.getSuperControl.setErrors({ invalid: true });
            }
        }

        if (['months'].includes(this.inputConfig.name.toLowerCase())) {
            if (parseInt(value) < 1 || parseInt(value) > 12) {
                this.getSuperControl.setErrors({ invalid: true });
            } else {
                this.getSuperControl.setErrors(null);
            }
        }

        if (['axles'].includes(this.inputConfig.name.toLowerCase())) {
            if (parseInt(value) < 1 || parseInt(value) > 17) {
                if (parseInt(value) < 1) {
                    this.getSuperControl.setErrors({ min: 1 });
                } else if (parseInt(value) > 17) {
                    this.getSuperControl.setErrors({ max: 17 });
                }
            } else {
                this.getSuperControl.setErrors(null);
            }
        }

        if (['full name'].includes(this.inputConfig.name.toLowerCase())) {
            if (this.getSuperControl.value) {
                const capitalizeWords = this.getSuperControl.value
                    .split(' ')
                    .map((word: string) => {
                        const firstLetter = word.charAt(0).toUpperCase();
                        const restOfWord = word.slice(1).toLowerCase();
                        return `${firstLetter}${restOfWord}`;
                    });

                this.input.nativeElement.value = capitalizeWords.join(' ');
            }
        }

        // Disable consectevily spaces
        if (
            [
                'business name',
                'shop name',
                'fuel stop',
                'producer name',
                'terminal name',
                'address',
                'license plate',
                'description',
                'emergency name',
                'cdl-number',
                'full name',
                'file name',
                'input dropdown label',
            ].includes(this.inputConfig.name.toLowerCase())
        ) {
            const sanitizedInput = this.input.nativeElement.value.replace(
                /\s{2,}/g,
                ' '
            ); // replace multiple spaces with a single space

            if (sanitizedInput !== this.input.nativeElement.value) {
                this.input.nativeElement.value = sanitizedInput;
                this.timeoutCleaner = setTimeout(() => {
                    this.input.nativeElement.setSelectionRange(
                        this.lastCursorSpacePosition - 1,
                        this.lastCursorSpacePosition - 1
                    );
                });
            }
        }

        if (['hos'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.getSuperControl.value
                    .toString()
                    .split('')
                    .every((value) => {
                        return value === '0';
                    }) &&
                this.getSuperControl.value.split('').length > 0
            ) {
                this.getSuperControl.patchValue('0');
                return;
            }
        }
    }

    public selectionChange(event: any) {
        if (event) {
            this.inputSelection = true;
        }
    }

    public onEditInput(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.editInputMode = true;
        this.inputConfig.dropdownLabelNew = false;
        this.inputConfig.blackInput = true;
        this.inputConfig.commands.active = true;
        this.focusInput = true;
        this.setInputCursorAtTheEnd(this.input.nativeElement);
        this.getSuperControl.setErrors({ required: true });
        this.commandEvent.emit({
            data: this.getSuperControl.value,
            action: 'Edit Input',
        });
    }

    public onCommands(event: Event, type: string, action: string) {
        event.stopPropagation();
        event.preventDefault();

        switch (type) {
            case 'pm-increment-decrement': {
                const value = convertThousanSepInNumber(
                    this.getSuperControl.value
                );
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
                        } else if (value >= 1000) {
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
                this.setInputCursorAtTheEnd(this.input.nativeElement);
                break;
            }
            case 'confirm-cancel': {
                switch (action) {
                    case 'confirm': {
                        this.commandEvent.emit({
                            data: this.getSuperControl.value,
                            action: 'confirm',
                            mode:
                                !this.inputConfig.dropdownLabelNew &&
                                this.inputConfig.name !==
                                    'Input Dropdown Bank Name'
                                    ? 'edit'
                                    : 'new',
                        });
                        break;
                    }
                    case 'cancel': {
                        this.commandEvent.emit({ action: 'cancel' });
                        break;
                    }
                    default: {
                        break;
                    }
                }
                this.getSuperControl.setErrors(null);
                this.editInputMode = false;
                this.inputConfig.dropdownLabelNew = false;
                this.inputConfig.commands.active = false;
                this.inputConfig.blackInput = false;
                this.onBlur();
                break;
            }
            case 'months': {
                switch (action) {
                    case 'minus': {
                        if (
                            parseInt(this.getSuperControl.value) === 1 ||
                            !this.getSuperControl.value
                        ) {
                            return;
                        }

                        this.getSuperControl.patchValue(
                            (this.getSuperControl.value
                                ? parseInt(this.getSuperControl.value)
                                : 0) - 1
                        );
                        break;
                    }
                    case 'plus': {
                        if (parseInt(this.getSuperControl.value) === 12) {
                            return;
                        }
                        this.getSuperControl.patchValue(
                            (this.getSuperControl.value
                                ? parseInt(this.getSuperControl.value)
                                : 0) + 1
                        );
                        break;
                    }
                    default: {
                        break;
                    }
                }
                if (
                    parseInt(this.getSuperControl.value) < 1 ||
                    parseInt(this.getSuperControl.value) > 12
                ) {
                    this.getSuperControl.setErrors({ invalid: true });
                } else {
                    this.getSuperControl.setErrors(null);
                }
                this.setInputCursorAtTheEnd(this.input.nativeElement);
                break;
            }
            default: {
                break;
            }
        }
    }

    public onPlaceholderIconEvent(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.editInputMode) {
            this.commandEvent.emit({
                data: this.getSuperControl.value,
                action: 'Toggle Dropdown',
            });
        } else {
            this.commandEvent.emit({
                data: this.getSuperControl.value,
                action: 'Placeholder Icon Event',
            });
        }
    }

    public onKeypress(event: KeyboardEvent): boolean {
        // Disable first character to be space
        if (
            !this.input.nativeElement.value &&
            /^\s*$/.test(String.fromCharCode(event.charCode))
        ) {
            event.preventDefault();
            return false;
        }

        if (this.inputConfig.priceSeparator) {
            if (
                this.inputService
                    .getInputRegexPattern('price-separator')
                    .test(String.fromCharCode(event.charCode))
            ) {
                if (
                    this.getSuperControl?.value?.length ===
                        this.originPriceSeparatorLimit &&
                    event.keyCode !== 46
                ) {
                    event.preventDefault();
                    return;
                }
                //  Disable multiple dots
                this.disableMultiplePoints(event);

                // Find index of dot
                this.hasDecimalIndex =
                    this.getSuperControl?.value?.indexOf('.');

                if (this.hasDecimalIndex >= 0) {
                    // 1. Divide number on decimal and integer part
                    let integerPart = this.getSuperControl.value.slice(
                        0,
                        this.hasDecimalIndex
                    );

                    if (!integerPart) {
                        integerPart = '0';
                    }

                    let decimalPart = this.getSuperControl.value.slice(
                        this.hasDecimalIndex + 1
                    );

                    // 2. Disable more than two decimals
                    if (decimalPart.length > 2) {
                        event.preventDefault();
                        return;
                    }

                    // 3. Get only two numbers of decimal part
                    decimalPart = decimalPart.slice(0, 2);

                    const currentPosition =
                        this.input.nativeElement.selectionStart;

                    // 4. Set formatted number
                    this.getSuperControl.patchValue(
                        integerPart + '.' + decimalPart
                    );

                    this.timeoutCleaner = setTimeout(() => {
                        if (event.keyCode === 51) {
                            this.cursorInputPosition =
                                this.input.nativeElement.selectionStart;
                            this.input.nativeElement.setSelectionRange(
                                currentPosition,
                                currentPosition
                            );
                        } else {
                            this.input.nativeElement.setSelectionRange(
                                currentPosition,
                                currentPosition
                            );
                        }
                    }, 0);
                }

                return true;
            }
            event.preventDefault();
            return false;
        }

        if (
            [
                'business name',
                'shop name',
                'fuel stop',
                'producer name',
                'terminal name',
            ].includes(this.inputConfig.name.toLowerCase())
        ) {
            if (
                this.inputService
                    .getInputRegexPattern('business name')
                    .test(String.fromCharCode(event.charCode))
            ) {
                this.disableMultiplePoints(event);
                this.disableConsecutivelySpaces(event);
                return true;
            }

            event.preventDefault();
            return false;
        }

        if (
            [
                'ein',
                'mc/ff',
                'phone',
                'phone-extension',
                'account-bank',
                'routing-bank',
                'ssn',
                'fuel-card',
                'empty-weight',
                'credit limit',
                'po box',
                'price',
                'trailer-volume',
                'repair-odometer',
                'usdot',
                'irp',
                'starting',
                'customer pay term',
                'customer credit',
                'default base',
                'each occurrence',
                'damage',
                'personal-adver-inj',
                'medical expenses',
                'bodily injury',
                'general aggregate',
                'products-comp-op-agg',
                'combined-single-limit',
                'single-conveyance',
                'deductable',
                'compreh-collision',
                'trailer-value-insurance-policy',
                'rent',
                'salary',
                'mileage',
                'months',
                'empty weight',
                'qty',
                'purchase price',
                'fuel tank size',
                'device no',
                'weight',
                'fuel per miles',
                'fuel price map',
                'amount',
            ].includes(this.inputConfig.name.toLowerCase())
        ) {
            // Only numbers
            if (
                this.inputService
                    .getInputRegexPattern('qty')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return true;
            }

            event.preventDefault();
            return false;
        }

        if (['email'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('email')
                    .test(String.fromCharCode(event.charCode))
            ) {
                this.disableConsecutivelyPoints(event);
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['invoice'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('invoice')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['address'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                /^[A-Za-z0-9\s.&/,_-]*$/.test(
                    String.fromCharCode(event.charCode)
                )
            ) {
                this.disableConsecutivelySpaces(event);
                return true;
            } else {
                event.preventDefault();
                return false;
            }
        }

        if (
            ['address-unit', 'department', 'vehicle-unit'].includes(
                this.inputConfig.name.toLowerCase()
            )
        ) {
            if (
                this.inputService
                    .getInputRegexPattern('address-unit')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['first name'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('first name')
                    .test(String.fromCharCode(event.charCode))
            ) {
                this.disableMultiplePoints(event);
                this.enableOneSpaceOnly(event);
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['last name'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('last name')
                    .test(String.fromCharCode(event.charCode))
            ) {
                this.enableOneSpaceOnly(event);
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['bank name'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('bank name')
                    .test(String.fromCharCode(event.charCode))
            ) {
                this.disableMultiplePoints(event);
                this.enableOneSpaceOnly(event);
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (
            ['vin-number', 'insurance-policy', 'ifta'].includes(
                this.inputConfig.name.toLowerCase()
            )
        ) {
            if (
                this.inputService
                    .getInputRegexPattern('vin-number')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return !/^[IiOQ]*$/.test(String.fromCharCode(event.charCode));
            }
            event.preventDefault();
            return false;
        }

        if (
            ['truck-trailer-model'].includes(
                this.inputConfig.name.toLowerCase()
            )
        ) {
            if (
                this.inputService
                    .getInputRegexPattern('truck-trailer-model')
                    .test(String.fromCharCode(event.charCode))
            ) {
                this.enableOneSpaceOnly(event);
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['year'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                /^0*$/.test(String.fromCharCode(event.charCode)) &&
                !this.input.nativeElement.value
            ) {
                event.preventDefault();
                return false;
            }

            if (
                this.inputService
                    .getInputRegexPattern('year')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return true;
            }

            event.preventDefault();
            return false;
        }

        if (['axles'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('axles')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['license plate'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('license plate')
                    .test(String.fromCharCode(event.charCode))
            ) {
                this.disableConsecutivelySpaces(event);
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['description'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('description')
                    .test(String.fromCharCode(event.charCode))
            ) {
                this.disableConsecutivelySpaces(event);
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['allow all'].includes(this.inputConfig.name.toLowerCase())) {
            if (/.*/.test(String.fromCharCode(event.charCode))) {
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['dba name'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('dba name')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['per mile'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('per mile')
                    .test(String.fromCharCode(event.charCode))
            ) {
                this.disableMultiplePoints(event);

                // Check for max length
                if (this.getSuperControl.value?.toString().includes('.')) {
                    this.inputConfig.maxLength = 4;
                } else {
                    this.inputConfig.maxLength = 2;
                }

                // Check for range
                if (
                    this.getSuperControl.value > this.inputConfig.max ||
                    this.getSuperControl.value < this.inputConfig.min
                ) {
                    this.getSuperControl.setErrors({ invalid: true });
                }
                return true;
            } else {
                event.preventDefault();
                return false;
            }
        }

        if (
            ['per stop', 'flat rate', 'per load'].includes(
                this.inputConfig.name.toLowerCase()
            )
        ) {
            if (
                this.inputService
                    .getInputRegexPattern('per stop')
                    .test(String.fromCharCode(event.charCode))
            ) {
                this.timeoutCleaner = setTimeout(() => {
                    if (this.getSuperControl.value) {
                        let perStopValue = this.getSuperControl.value.replace(
                            /,/g,
                            ''
                        );
                        if (
                            perStopValue > this.inputConfig.max ||
                            perStopValue < this.inputConfig.min
                        ) {
                            this.getSuperControl.setErrors({ invalid: true });
                            return false;
                        }
                        return true;
                    }
                }, 0);
            } else {
                event.preventDefault();
                return false;
            }
        }

        if (
            ['relationship', 'scac'].includes(
                this.inputConfig.name.toLowerCase()
            )
        ) {
            if (
                this.inputService
                    .getInputRegexPattern('emergency name')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['emergency name'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('emergency name')
                    .test(String.fromCharCode(event.charCode))
            ) {
                this.disableConsecutivelySpaces(event);
                this.enableOneSpaceOnly(event);
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['fuel-store'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('fuel store')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['hos'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                !this.inputSelection &&
                this.inputService
                    .getInputRegexPattern('hos')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return (
                    this.getSuperControl.value * 10 + event.charCode - 48 <=
                    this.inputConfig.max
                );
            } else {
                if (this.inputSelection) {
                    this.getSuperControl.patchValue(
                        String.fromCharCode(event.charCode)
                    );
                    this.inputSelection = false;
                }

                event.preventDefault();
                return false;
            }
        }

        if (
            ['full parking slot', 'parking slot'].includes(
                this.inputConfig.name.toLowerCase()
            )
        ) {
            if (
                this.inputService
                    .getInputRegexPattern('full parking slot')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return true;
            } else {
                event.preventDefault();
                return false;
            }
        }

        if (['cdl-number'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('cdl-number')
                    .test(String.fromCharCode(event.charCode))
            ) {
                this.enableOneSpaceOnly(event);
                this.disableConsecutivelySpaces(event);
                return true;
            } else {
                event.preventDefault();
                return false;
            }
        }

        // All Simbols
        if (
            ['username', 'nickname', 'password'].includes(
                this.inputConfig.name.toLowerCase()
            )
        ) {
            if (
                this.inputService
                    .getInputRegexPattern('username')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return true;
            } else {
                event.preventDefault();
                return false;
            }
        }

        if (['full name'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('full name')
                    .test(String.fromCharCode(event.charCode))
            ) {
                this.enableOneSpaceOnly(event);
                this.disableMultiplePoints(event);
                this.disableConsecutivelySpaces(event);
                return true;
            } else {
                event.preventDefault();
                return false;
            }
        }

        if (['tollvalidation'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('tollvalidation')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return true;
            } else {
                event.preventDefault();
                return false;
            }
        }

        // Just characters and numbers
        if (
            ['prefix', 'suffix', 'parking name'].includes(
                this.inputConfig.name.toLowerCase()
            )
        ) {
            if (
                this.inputService
                    .getInputRegexPattern('prefix')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return true;
            } else {
                event.preventDefault();
                return false;
            }
        }

        if (['file name'].includes(this.inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('file name')
                    .test(String.fromCharCode(event.charCode))
            ) {
                event.preventDefault();
                return false;
            } else {
                this.disableConsecutivelySpaces(event);
                return true;
            }
        }

        if (
            ['insurer name', 'office name'].includes(
                this.inputConfig.name.toLowerCase()
            )
        ) {
            if (
                this.inputService
                    .getInputRegexPattern('producer name')
                    .test(String.fromCharCode(event.charCode))
            ) {
                this.disableMultiplePoints(event);
                return true;
            } else {
                event.preventDefault();
                return false;
            }
        }

        if (
            ['input dropdown label'].includes(
                this.inputConfig.name.toLowerCase()
            )
        ) {
            this.disableConsecutivelySpaces(event);
            this.disableConsecutivelyPoints(event);
        }

        this.input.nativeElement.value.trim();
    }

    private enableOneSpaceOnly(event: any) {
        if (
            /^\s*$/.test(String.fromCharCode(event.charCode)) ||
            this.getSuperControl.value?.includes(' ')
        ) {
            this.oneSpaceOnlyCounter++;
        }

        if (
            this.oneSpaceOnlyCounter > 1 &&
            /^\s*$/.test(String.fromCharCode(event.charCode))
        ) {
            event.preventDefault();
            return false;
        }

        return true;
    }

    private disableConsecutivelySpaces(event: any) {
        const inputElement = this.input.nativeElement as HTMLInputElement;

        // Get cursor position
        const cursorPosition = inputElement.selectionStart;

        // If the cursor is in the middle of a word, allow spaces
        if (
            cursorPosition > 0 &&
            !/\s/.test(inputElement.value[cursorPosition - 1]) &&
            !/\s/.test(inputElement.value[cursorPosition])
        ) {
            return;
        }

        // If the user is typing a space and the previous character is a space, prevent the default behavior
        if (
            event.key === ' ' &&
            /\s/.test(inputElement.value[cursorPosition - 1])
        ) {
            event.preventDefault();
        }

        // Save the cursor position for the next input event
        this.lastCursorSpacePosition = cursorPosition;
    }

    private disableConsecutivelyPoints(event: any) {
        if (/^[.]*$/.test(String.fromCharCode(event.charCode))) {
            this.numberOfConsecutivelyPoints++;
            if (this.numberOfConsecutivelyPoints > 1) {
                event.preventDefault();
                return false;
            }
        } else {
            this.numberOfConsecutivelyPoints = 0;
        }
    }

    private disableMultiplePoints(event: any) {
        if (/^[.]*$/.test(String.fromCharCode(event.charCode))) {
            if (!this.getSuperControl.value) {
                event.preventDefault();
                return false;
            }

            if (this.getSuperControl.value?.toString().includes('.')) {
                event.preventDefault();
                return false;
            }

            this.numberOfPoints++;
            if (this.numberOfPoints > 1) {
                event.preventDefault();
                return false;
            }
        } else {
            this.numberOfPoints = 0;
        }
    }

    public onPaste(event?: any) {
        event.preventDefault();

        this.pasteCheck(
            event.clipboardData.getData('text'),
            this.inputService.getInputRegexPattern(
                this.inputConfig.name.toLowerCase()
            )
        );
    }

    private pasteCheck(pastedText: any, regexType?: RegExp) {
        let newText = '';
        let formatedText = '';
        let countOfCaracters = 0;

        // Max Length For Paste
        if (this.inputConfig.maxLength) {
            if (
                pastedText.startsWith('+1') ||
                (pastedText.startsWith('1') &&
                    this.inputConfig.name === 'Phone')
            ) {
                if (pastedText.startsWith('+1')) {
                    pastedText = pastedText.split('+1')[1];
                } else {
                    pastedText = pastedText.slice(pastedText.indexOf('1') + 1);
                }
            }
            for (const character of pastedText) {
                if (character.match(regexType)) {
                    formatedText += character;
                    countOfCaracters++;
                }

                if (countOfCaracters === this.inputConfig.maxLength) {
                    break;
                }
            }
        } else {
            for (const character of pastedText) {
                if (character.match(regexType)) {
                    formatedText += character;
                }
            }
        }

        // Check Multiple Spaces in Word
        for (let i = 0; i < formatedText.length; i++) {
            if (formatedText[i] === ' ') {
                if (formatedText[i + 1] !== ' ') {
                    newText += formatedText[i];
                }
            } else {
                newText += formatedText[i];
            }
        }

        if (
            ['phone', 'ein', 'ssn'].includes(
                this.inputConfig.name.toLowerCase()
            )
        ) {
            if ('phone' === this.inputConfig.name.toLowerCase()) {
                this.timeoutCleaner = setTimeout(() => {
                    this.getSuperControl.setErrors(null);

                    this.input.nativeElement.value = newText.substring(0, 10);
                    this.getSuperControl.setValue(
                        '(' +
                            this.input.nativeElement.value.substring(0, 3) +
                            ') ' +
                            this.input.nativeElement.value.substring(3, 6) +
                            '-' +
                            this.input.nativeElement.value.substring(6)
                    );
                }, 0);
            }

            if ('ein' === this.inputConfig.name.toLowerCase()) {
                this.timeoutCleaner = setTimeout(() => {
                    this.getSuperControl.setErrors(null);
                    this.input.nativeElement.value = newText.substring(0, 9);
                    this.getSuperControl.patchValue(
                        this.input.nativeElement.value.substring(0, 2) +
                            '-' +
                            this.input.nativeElement.value.substring(2)
                    );
                }, 0);
            }

            if ('ssn' === this.inputConfig.name.toLowerCase()) {
                this.timeoutCleaner = setTimeout(() => {
                    this.getSuperControl.setErrors(null);
                    this.input.nativeElement.value = newText.substring(0, 9);
                    this.getSuperControl.patchValue(
                        this.input.nativeElement.value.substring(0, 3) +
                            '-' +
                            this.input.nativeElement.value.substring(3, 5) +
                            '-' +
                            this.input.nativeElement.value.substring(5)
                    );
                }, 0);
            }
        }

        // Text Transform Format
        this.transformText(newText, true);
    }

    // Optimization for *ngFor
    public trackIdentity = (index: number): number => index;

    //------------------- Date & Time Picker -------------------

    public onDatePaste(e: any) {
        e.preventDefault();

        const pasteText = e.clipboardData.getData('text');
        const pastedDate = new Date(pasteText);
        if (!isNaN(pastedDate.getTime())) {
            this.setTimeDateInput(pastedDate);
            this.selectSpanByTabIndex(this.selectionInput);
        }
    }

    selectionInput: number = -1;

    setSelection(e) {
        e.preventDefault();
        e.stopPropagation();

        const element = e.target;
        this.focusInput = true;

        const selectionInput = parseInt(element.getAttribute('tabindex'));

        if (window.getSelection().toString().length > 10) {
            this.holder1.nativeElement.focus();
            this.selectionInput = 0;
            this.setSpanSelection(this.holder1.nativeElement);
            clearTimeout(this.dateTimeMainTimer);
            clearTimeout(this.focusBlur);
            return;
        }

        clearTimeout(this.dateTimeMainTimer);
        if (element.classList.contains('main')) {
            this.selectionInput = selectionInput;
            this.setSpanSelection(element);
        } else {
            if (this.selectionInput == -1) {
                this.span1.nativeElement.focus();
                this.selectionInput = 0;
                this.setSpanSelection(this.span1.nativeElement);
            } else {
                e.preventDefault();
                this.selectSpanByTabIndex(this.selectionInput);
            }
        }
    }

    setSpanSelection(element) {
        let range, selection;

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
        this.selectionInput = -1;

        this.holder1.nativeElement.focus();
        this.setSpanSelection(this.holder1.nativeElement);
    }

    changeSelection(e, noPreventDefault = false): void {
        if (!noPreventDefault) {
            e.preventDefault();
            e.stopPropagation();
        }

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
                    this.selectSpanByTabIndex(this.selectionInput, true);
                }
            } else if (e.keyCode == 39 || e.keyCode == 9) {
                if (this.selectionInput != 2 && !e.shiftKey) {
                    this.selectionInput = this.selectionInput + 1;
                    this.selectSpanByTabIndex(this.selectionInput, true);
                } else if (e.keyCode == 9 && !e.shiftKey) {
                    let allInputs = document.querySelectorAll(
                        'input.input-control'
                    ) as NodeListOf<HTMLInputElement>;
                    [...(allInputs as any)].map((item, indx) => {
                        if (item === this.input.nativeElement) {
                            if (allInputs[indx + 1]) {
                                allInputs[indx + 1].focus();
                            } else {
                                this.focusInput = false;
                                this.blurOnDateTime();
                            }
                            this.selectionInput = -1;
                            return;
                        }
                    });
                } else if (
                    e.shiftKey &&
                    e.keyCode == 9 &&
                    this.selectionInput != 0
                ) {
                    if (this.selectionInput == -1) {
                        this.selectionInput = 3;
                    }
                    this.selectionInput = this.selectionInput - 1;
                    this.selectSpanByTabIndex(this.selectionInput);
                } else if (
                    e.shiftKey &&
                    e.keyCode == 9 &&
                    this.selectionInput == 0
                ) {
                    let allInputs = document.querySelectorAll('input');
                    [...(allInputs as any)].map((item, indx) => {
                        if (item === this.input.nativeElement) {
                            if (allInputs[indx - 1]) {
                                allInputs[indx - 1].focus();
                            }
                            this.selectionInput = -1;
                            return;
                        }
                    });
                }
            } else if (e.keyCode == 38) {
                this.setDateTimeModel('up');
            } else if (e.keyCode == 40) {
                this.setDateTimeModel('down');
            } else if (e.keyCode == 8 || e.keyCode == 46) {
                this.handleKeyboardInputs(e, true);
            }
        } else if (!this.isNumber(e)) {
            if (!noPreventDefault) {
                e.preventDefault();
            }
        } else {
            if (!noPreventDefault) {
                e.preventDefault();
            }
            if (this.selectionInput == -1) {
                this.selectionInput = 0;
            }
            this.handleKeyboardInputs(e);
        }
    }

    handleKeyboardInputs(e: KeyboardEvent, isRestart?: boolean) {
        const span1Value =
            isNaN(this.span1.nativeElement.innerHTML) || this.newInputChanged
                ? undefined
                : parseInt(this.span1.nativeElement.innerHTML);
        const span2Value =
            isNaN(this.span2.nativeElement.innerHTML) || this.newInputChanged
                ? undefined
                : parseInt(this.span2.nativeElement.innerHTML);
        const span3Value =
            isNaN(this.span3.nativeElement.innerHTML) || this.newInputChanged
                ? ''
                : parseInt(this.span3.nativeElement.innerHTML);

        this.newInputChanged = false;
        if (this.inputConfig.name === 'datepicker') {
            if (this.selectionInput == 0) {
                if (isRestart) {
                    this.span1.nativeElement.innerHTML = 'mm';
                    this.selectionInput = 0;
                    this.selectSpanByTabIndex(0);
                } else if (span1Value != undefined) {
                    let final_value = parseInt(`${span1Value}${e.key}`);
                    if (final_value > 12) {
                        this.span1.nativeElement.innerHTML = (
                            '0' + parseInt(e.key)
                        ).slice(-2);
                        this.selectionInput = 1;
                        this.selectSpanByTabIndex(1, true);
                    } else {
                        this.dateTimeInputDate = new Date(
                            this.dateTimeInputDate.setMonth(
                                parseInt(
                                    this.span1.nativeElement.innerHTML +
                                        parseInt(e.key)
                                ) - 1
                            )
                        );

                        if (!final_value) {
                            this.span1.nativeElement.innerHTML = 'mm';
                        } else {
                            this.span1.nativeElement.innerHTML = (
                                this.span1.nativeElement.innerHTML +
                                parseInt(e.key)
                            ).slice(-2);
                        }

                        this.selectionInput = 1;
                        this.selectSpanByTabIndex(1, true);
                    }
                } else {
                    if (parseInt(e.key)) {
                        this.dateTimeInputDate = new Date(
                            this.dateTimeInputDate.setMonth(parseInt(e.key) - 1)
                        );
                    }

                    const final_value = ('0' + parseInt(e.key)).slice(-2);

                    this.span1.nativeElement.innerHTML = final_value;

                    if (parseInt(`1${e.key}`) > 12) {
                        this.selectionInput = 1;
                        this.selectSpanByTabIndex(1, true);
                    } else {
                        this.selectSpanByTabIndex(0);
                    }
                }
            } else if (this.selectionInput == 1) {
                if (isRestart) {
                    this.span2.nativeElement.innerHTML = 'dd';
                    this.selectionInput = 0;
                    this.selectSpanByTabIndex(0, true);
                } else if (span2Value != undefined) {
                    let final_value = parseInt(`${span2Value}${e.key}`);
                    if (final_value > 31) {
                        this.span2.nativeElement.innerHTML = (
                            '0' + parseInt(e.key)
                        ).slice(-2);
                        this.selectionInput = 2;
                        this.selectSpanByTabIndex(2, true);
                    } else {
                        this.dateTimeInputDate = new Date(
                            this.dateTimeInputDate.setDate(
                                parseInt(
                                    this.span2.nativeElement.innerHTML +
                                        parseInt(e.key)
                                )
                            )
                        );

                        if (!final_value) {
                            this.span2.nativeElement.innerHTML = 'dd';
                        } else {
                            this.span2.nativeElement.innerHTML = (
                                this.span2.nativeElement.innerHTML +
                                parseInt(e.key)
                            ).slice(-2);
                        }

                        this.selectionInput = 2;
                        this.selectSpanByTabIndex(2, true);
                    }
                } else {
                    if (parseInt(e.key)) {
                        this.dateTimeInputDate = new Date(
                            this.dateTimeInputDate.setDate(parseInt(e.key))
                        );
                    }

                    this.span2.nativeElement.innerHTML = (
                        '0' + parseInt(e.key)
                    ).slice(-2);

                    if (parseInt(`1${e.key}`) > 31) {
                        this.selectionInput = 2;
                        this.selectSpanByTabIndex(2, true);
                    } else {
                        this.selectSpanByTabIndex(1);
                    }
                }
            } else {
                if (isRestart) {
                    this.span3.nativeElement.innerHTML = 'yy';
                    this.selectionInput = 1;
                    this.selectSpanByTabIndex(1, true);
                } else if (!span3Value || span3Value.toString().length == 2) {
                    this.span3.nativeElement.innerHTML = (
                        '0' + parseInt(e.key)
                    ).slice(-2);
                    this.dateTimeInputDate = new Date(
                        this.dateTimeInputDate.setFullYear(
                            parseInt(`200${parseInt(e.key)}`)
                        )
                    );

                    this.selectSpanByTabIndex(2);
                } else {
                    const finalYear = parseInt(
                        this.span3.nativeElement.innerHTML + parseInt(e.key)
                    );

                    const finalShowYear =
                        finalYear > 31
                            ? parseInt(`19${finalYear}`)
                            : parseInt(`20${finalYear}`);
                    this.dateTimeInputDate = new Date(
                        this.dateTimeInputDate.setFullYear(finalShowYear)
                    );
                    this.span3.nativeElement.innerHTML = (
                        this.span3.nativeElement.innerHTML + parseInt(e.key)
                    ).slice(-2);
                    this.selectSpanByTabIndex(2);
                }
            }
        } else {
        }
    }

    selectSpanByTabIndex(indx, changeTab?: boolean) {
        switch (indx) {
            case 0:
                this.setSpanSelection(this.span1.nativeElement);
                break;
            case 1:
                this.setSpanSelection(this.span2.nativeElement);
                break;
            case 2:
                this.setSpanSelection(this.span3.nativeElement);
                break;
            default:
                this.setSpanSelection(this.holder1.nativeElement);
        }

        if (changeTab) this.newInputChanged = true;
    }

    setDateTimeModel(direction: string) {
        if (this.selectionInput == -1) this.selectionInput = 0;
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
                        this.dateTimeInputDate.setDate(
                            this.dateTimeInputDate.getDate() + 1
                        )
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
                        this.dateTimeInputDate.setDate(
                            this.dateTimeInputDate.getDate() + 1
                        )
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
                        '0' +
                        (selectedHours > 12
                            ? selectedHours - 12
                            : selectedHours)
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
                        this.span3.nativeElement.innerHTML == 'AM'
                            ? 'PM'
                            : 'AM';
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
                        '0' +
                        (selectedHours > 12
                            ? selectedHours - 12
                            : selectedHours)
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
                        this.span3.nativeElement.innerHTML == 'AM'
                            ? 'PM'
                            : 'AM';
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
            (charCode >= 48 && charCode <= 57) ||
            (charCode >= 96 && charCode <= 105)
        );
    }

    onPopoverShown() {
        if (!this.inputConfig.dropdownLabel) {
            this.focusInput = true;
            this.showDateInput = true;
        }
    }

    onPopoverHidden() {
        if (!this.inputConfig.dropdownLabel) {
            this.focusInput = false;
            this.blurOnDateTime();
        }
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
                    this.calendarService.dateChanged.next(
                        this.dateTimeInputDate
                    );
                } else {
                    this.span1.nativeElement.innerHTML = 'mm';
                    this.span2.nativeElement.innerHTML = 'dd';
                    this.span3.nativeElement.innerHTML = 'yy';
                    this.dateTimeInputDate = new Date();
                    this.showDateInput = false;
                    this.resetForms(); // PITANJE STO SE OVO SKLANJA I UOPSTE STO JE TREBALO
                }
            } else {
                if (
                    !isNaN(this.span1.nativeElement.innerHTML) &&
                    !isNaN(this.span2.nativeElement.innerHTML)
                ) {
                    this.calendarService.dateChanged.next(
                        this.dateTimeInputDate
                    );
                } else {
                    this.span1.nativeElement.innerHTML = 'HH';
                    this.span2.nativeElement.innerHTML = 'MM';
                    this.setTimePickerTime();
                    this.showDateInput = false;
                    //this.resetForms(); // PITANJE STO SE OVO SKLANJA I UOPSTE STO JE TREBALO
                }
            }

            clearTimeout(this.dateTimeMainTimer);
            this.focusInput = false;
            this.selectionInput = -1;
            this.newInputChanged = true;
            this.refChange.detectChanges();
        }, 100);
    }

    selectLastOneForSelection() {
        clearTimeout(this.wholeInputSelection);
        let range, selection;

        this.showDateInput = true;
        this.selectionInput = -1;
        this.focusInput = true;

        if (window.getSelection && document.createRange) {
            selection = window.getSelection();
            range = document.createRange();
            range.setStart(this.span3.nativeElement, 1);
            range.setEnd(this.span3.nativeElement, 1);

            selection.removeAllRanges();
            selection.addRange(range);
        }

        this.timeoutCleaner = setTimeout(() => {
            clearTimeout(this.dateTimeMainTimer);
            clearTimeout(this.focusBlur);
        }, 90);
    }

    selectLastOneAfterMoseUp() {
        this.selectionInput = 2;
        this.span3.nativeElement.focus();
        this.setSpanSelection(this.span3.nativeElement);
        this.showDateInput = true;
        this.timeoutCleaner = setTimeout(() => {
            clearTimeout(this.dateTimeMainTimer);
            clearTimeout(this.focusBlur);
            clearTimeout(this.wholeInputSelection);
        }, 90);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        clearTimeout(this.timeoutCleaner);
        clearTimeout(this.wholeInputSelection);
        clearTimeout(this.dateTimeMainTimer);
    }
}
