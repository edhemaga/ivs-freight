import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
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
import {
    ControlValueAccessor,
    NgControl,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';

import { combineLatest, Subject, takeUntil } from 'rxjs';

// modules
import {
    NgbDropdownConfig,
    NgbPopover,
    NgbModule,
    NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxMaskModule } from 'ngx-mask';

// moment
import moment from 'moment';

// configs
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// pipes
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';
import { InputTypePipe } from '@shared/components/ta-input/pipes/input-type.pipe';
import { TaSvgPipe } from '@shared/pipes/ta-svg.pipe';
import { InputErrorPipe } from '@shared/components/ta-input/pipes/input-error.pipe';
import { LoadStatusColorPipe } from '@shared/pipes/load-status-color.pipe';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// directives
import { HoverSvgDirective } from '@shared/directives/hover-svg.directive';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { CalendarDateTimePickerService } from '@shared/services/calendar-datetime-picker.service';
import { FormService } from '@shared/services/form.service';

// components
import { TaCustomDatetimePickersComponent } from '@shared/components/ta-custom-datetime-pickers/ta-custom-datetime-pickers.component';
import { TaSpinnerComponent } from '@shared/components/ta-spinner/ta-spinner.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { LoadModalProgressBarComponent } from '@pages/load/pages/load-modal/components/load-modal-progress-bar/load-modal-progress-bar.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

@Component({
    selector: 'app-ta-input',
    templateUrl: './ta-input.component.html',
    styleUrls: ['./ta-input.component.scss'],
    providers: [
        NgbDropdownConfig,
        CalendarDateTimePickerService,
        ThousandSeparatorPipe,
        InputTypePipe,
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        // Module
        CommonModule,
        AngularSvgIconModule,
        FormsModule,
        NgxMaskModule,
        NgbModule,
        ReactiveFormsModule,
        NgbPopoverModule,

        // Component
        TaAppTooltipV2Component,
        TaCustomDatetimePickersComponent,
        TaSpinnerComponent,
        TaProfileImagesComponent,
        LoadModalProgressBarComponent,

        // Pipe
        InputTypePipe,
        TaSvgPipe,
        InputErrorPipe,
        LoadStatusColorPipe,

        // Directive
        HoverSvgDirective,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TaInputComponent
    implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor
{
    @ViewChild('input', { static: true }) public input: ElementRef;
    @ViewChild('span1', { static: false }) span1: ElementRef;
    @ViewChild('span2', { static: false }) span2: ElementRef;
    @ViewChild('span3', { static: false }) span3: ElementRef;
    @ViewChild('holder1', { static: false }) holder1: ElementRef;
    @ViewChild('t2') t2: any;
    @ViewChild(NgbPopover) ngbMainPopover: NgbPopover;

    @Input() incorrectValue: boolean;
    @Input() selectedDropdownLabelColor: any;
    @Input() template: string;

    public _inputConfig: ITaInput = null;
    @Input() set inputConfig(config: ITaInput) {
        this._inputConfig = config;
        // Price Separator
        if (this._inputConfig.priceSeparator) {
            this.originPriceSeparatorLimit =
                this._inputConfig.priceSeparatorLimitation;
        }

        // DatePicker
        if (
            this._inputConfig.name === 'datepicker' ||
            this._inputConfig.name === 'timepicker' ||
            this._inputConfig.name === 'datepickerBankCard'
        ) {
            this.setTimePickerTime();
            this.calendarService.dateChanged
                .pipe(takeUntil(this.destroy$))
                .subscribe((date) => {
                    if (!this._inputConfig.isDisabled) {
                        this.setTimeDateInput(date);
                        this.t2.close();
                    }
                });
        }

        // Custom Range
        if (this._inputConfig.isUsingCustomPeriodRange) {
            if (this._inputConfig.isDisplayingCustomPeriodRange)
                this.focusInput = true;
            else this.focusInput = false;
        }

        // When add mode in dropdown
        if (
            this._inputConfig.commands?.active &&
            !this._inputConfig.isDisabled
        ) {
            if (this._inputConfig.commands.type === 'confirm-cancel') {
                if (!this._inputConfig.blueInput)
                    this._inputConfig.blackInput = true;
                this.isVisibleCommands = true;
                this.focusInput = true;
                this.input.nativeElement.focus();
            }
        }
    }

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
        new EventEmitter<boolean>();

    // Dropdown
    @Output('showHideDropdown') showHideDropdownEvent: EventEmitter<boolean> =
        new EventEmitter<boolean>();
    @Output('dropDownKeyNavigation') dropDownKeyNavigationEvemt: EventEmitter<{
        keyCode: number;
        data: ITaInput | any;
    }> = new EventEmitter<{
        keyCode: number;
        data: ITaInput | any;
    }>();

    public focusInput: boolean = false;
    public touchedInput: boolean = false;

    // Password
    public togglePassword: boolean = false;

    // Date
    public showDateInput: boolean = false;
    public dateTimeInputDate: Date = new Date();
    public newInputChanged: boolean = false;

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

    // Bluring
    public focusBlur: any;

    // Price Separator
    public cursorInputPosition: number;
    public hasDecimalIndex: number = -1;
    public originPriceSeparatorLimit: number;
    public isDotDeleted: boolean = false;
    // DatePicker
    public wholeInputSelection: any;

    // Timeout
    public timeoutCleaner: any = null;
    public inputCommandsTimeout = null;
    public passwordTimeout = null;

    // Destroy
    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        @Self() public superControl: NgControl,
        private inputService: TaInputService,
        private calendarService: CalendarDateTimePickerService,
        private thousandSeparatorPipe: ThousandSeparatorPipe,
        private refChange: ChangeDetectorRef,
        private formService: FormService,
        private cdRef: ChangeDetectorRef
    ) {
        this.superControl.valueAccessor = this;
    }

    get getSuperControl() {
        return this.superControl.control;
    }

    public writeValue(obj: any): void {
        this.changeInput.emit(obj);
        if (
            this._inputConfig.name === 'datepicker' ||
            this._inputConfig.name === 'timepicker' ||
            this._inputConfig.name === 'datepickerBankCard'
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

    public setDisabledState?(_: boolean): void {}

    ngOnInit(): void {
        //Track input changes

        const combinedChanges = combineLatest([
            this.getSuperControl.valueChanges,
            this.getSuperControl.statusChanges,
        ]);

        combinedChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.cdRef.detectChanges();
        });

        //Reset Form
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

    ngAfterViewInit(): void {
        // Toggle label transition animation
        $('.input-label').addClass('no-transition');

        this.timeoutCleaner = setTimeout(() => {
            $('.input-label').removeClass('no-transition');
        }, 1000);

        // Auto Focus First Input

        if (this._inputConfig.autoFocus && !this.getSuperControl?.value) {
            this.timeoutCleaner = setTimeout(() => {
                this.input.nativeElement.focus();
                this.focusInput = true;
                this._inputConfig.autoFocus = false;
            }, 30);
        }
    }

    public onFocus(e?): void {
        this.focusInputEvent.emit(true);

        // DropDown Label
        if (this._inputConfig.dropdownLabel) {
            this._inputConfig.placeholderIcon = 'ic_dynamic_focus_label.svg';
        }

        // Datepicker
        if (
            (this._inputConfig.name === 'datepicker' ||
                this._inputConfig.name === 'timepicker' ||
                this._inputConfig.name === 'datepickerBankCard') &&
            !this._inputConfig.isDisabled
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

            this.toggleDropdownOptions()
        }

        // Dropdown
        if (this._inputConfig.isDropdown) {
            this.dropdownToggler = true;
            this.showHideDropdownEvent.emit(this.dropdownToggler);
        }

        // Commands
        if (this._inputConfig.commands && !this._inputConfig.isDisabled) {
            if (this._inputConfig.commands.type === 'months') {
                if (!this._inputConfig.blueInput)
                    this._inputConfig.blackInput = true;
                this._inputConfig.commands.active = true;
                this.isVisibleCommands = true;
            }

            if (this._inputConfig.commands.type === 'pm-increment-decrement') {
                this._inputConfig.blackInput = false;
                this._inputConfig.commands.active = true;
                this.isVisibleCommands = true;
            }
        }

        this.focusInput = true;
    }

    public onBlur(e?): void {
        // DropDown Label
        if (this._inputConfig.dropdownLabel && !this.editInputMode) {
            this._inputConfig.placeholderIcon = 'ic_dynamic_label.svg';
        }

        // Edit Input
        if (this.editInputMode) {
            this.getSuperControl.setErrors({ invalid: true });
            return;
        }

        // Datepicker;
        if (this.preventBlur) {
            this.preventBlur = false;
            return;
        }

        // Bank
        if (this._inputConfig.name === 'Input Dropdown Bank Name') {
            this._inputConfig.blackInput = false;
        }

        // Price Separator - remove dot on focus out
        if (
            this._inputConfig.priceSeparator &&
            this.getSuperControl?.value &&
            this.getSuperControl?.value?.indexOf('.') >= 0
        ) {
            // 4.1. Check for Dot position
            this.hasDecimalIndex = this.getSuperControl.value.indexOf('.');

            let integerPart = this.thousandSeparatorPipe.transform(
                this.getSuperControl.value
                    .slice(0, this.hasDecimalIndex)
                    .slice(0, this._inputConfig.priceSeparatorLimitation)
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
        if (this._inputConfig.isDropdown || this._inputConfig.dropdownLabel) {
            if (
                (this._inputConfig.name === 'datepicker' ||
                    this._inputConfig.name === 'timepicker' ||
                    this._inputConfig.name === 'datepickerBankCard') &&
                !this._inputConfig.isDisabled
            ) {
                if (e?.target?.nodeName === 'INPUT') {
                    return;
                }
                // Datepicker
                if (
                    this._inputConfig.name === 'datepicker' ||
                    this._inputConfig.name === 'timepicker' ||
                    this._inputConfig.name === 'datepickerBankCard'
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
        }
        // Normal, without dropdown
        else {
            let selection = window.getSelection();
            selection.removeAllRanges();

            // Input Commands
            if (this._inputConfig.commands) {
                this.blurOnCommands();
            }

            // Password
            if (this._inputConfig.type === 'password') {
                this.blurOnPassword();
            }
            // Normal focus out
            else {
                this.focusInput = false;
            }
        }
        this.blurInput.emit(true);
        this.touchedInput = true;
    }

    private removeLeadingZero(): void {
        if (this._inputConfig.removeLeadingZero) {
            const currentValue = this.getSuperControl.value;

            if(!currentValue) {
                this.getSuperControl.patchValue('');
                this.getSuperControl.setErrors(null);
                return;
            }
    
            if (this._inputConfig.negativeLeadingZero) {
                const isNegative = currentValue.startsWith('-');
    
                if (isNegative) {
                     // Get the part after the negative sign
                    const numberPart = currentValue.slice(1);
                    // Remove leading zeros
                    const transformedNumber = numberPart.replace(/^0+(?=\d)/, ''); 
                    this.getSuperControl.patchValue(`-${transformedNumber}`); 
                } else {
                    this.getSuperControl.patchValue(currentValue.replace(/^0+(?=\d)/, ''));
                }
    
            } else {
                this.getSuperControl.patchValue(currentValue.replace(/^0+(?!$)/, ''));
            }
        }
    }

    public blurOnPassword() {
        this.passwordTimeout = setTimeout(() => {
            this.focusInput = false;
            this.input.nativeElement.blur();

            this.refChange.detectChanges();
        }, 150);
    }

    private blurOnDropDownArrow() {
        this.timeoutCleaner = setTimeout(() => {
            this.dropdownToggler = false;
            this.focusInput = false;
            this.showHideDropdownEvent.emit(this.dropdownToggler);
        }, 150);
    }

    public clearInput(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        // Clear whole input
        if (this._inputConfig.removeInput) {
            this.clearInputEvent.emit(true);
            return;
        }
        // Incorrect Input
        if (this._inputConfig.incorrectInput) {
            this.incorrectValue = !this.incorrectValue;
            this.incorrectInput.emit(this.incorrectValue);
        }
        // Native clear
        else {
            this.input.nativeElement.value = null;
            this.getSuperControl.setValue(null);
            this.numberOfConsecutivelySpaces = 0;
            this.numberOfConsecutivelyPoints = 0;
            this.numberOfPoints = 0;
            this.oneSpaceOnlyCounter = 0;
            this._inputConfig.dropdownImageInput = null;
            this.touchedInput = true;
            this.focusInput = false;
            if (
                ['datepicker', 'timepicker', 'datepickerBankCard'].includes(
                    this._inputConfig.name
                )
            ) {
                this.resetDateTimeInputs();
            }

            this.clearInputEvent.emit(true);
        }
    }

    // Dropdowns
    public toggleDropdownOptions() {
        if (this._inputConfig.isDisabled) {
            return;
        }

        if (
            this._inputConfig.name === 'datepicker' ||
            this._inputConfig.name === 'timepicker' ||
            this._inputConfig.name === 'datepickerBankCard'
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

        this.showHideDropdownEvent.emit(this.dropdownToggler);

        if (this.dropdownToggler) {
            this.input.nativeElement.focus();
            this.focusInput = true;
        }
    }

    // Password
    public onTogglePassword(event: any): void {
        event.preventDefault();
        clearTimeout(this.passwordTimeout);

        this.togglePassword = !this.togglePassword;

        if (this.focusInput) {
            this.setInputCursorAtTheEnd(this.input.nativeElement);
        }
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

    //-------------- Event Input Actions
    public onKeydown(event) {
        if (event) {
            this.capsLockOn = event?.getModifierState?.('CapsLock');
        }

        if (this._inputConfig.priceSeparator) {
            const valueToString = String(this.getSuperControl?.value);

            this.isDotDeleted = valueToString?.includes('.');
        }

        // Disable for phone field first character to be 0
        if (this._inputConfig.name.toLowerCase() === 'phone') {
            if (event.target.selectionStart === 0 && event.key === '0') {
                event.preventDefault();
            }
        }

        if (event.keyCode === 9) {
            this.dropDownKeyNavigationEvemt.emit({
                keyCode: event.keyCode,
                data: null,
            });
        }
    }

    public onKeyup(event): void {
        if (event) {
            this.capsLockOn = event?.getModifierState?.('CapsLock');
        }
        // Reset function property for disabling multiple dots
        const valueToString = String(this.getSuperControl?.value);

        if (this.isDotDeleted && !valueToString?.includes('.')) {
            this.numberOfPoints = 0;
        }
        if (
            event.keyCode == 8 &&
            !(this._inputConfig.isDropdown || this._inputConfig.dropdownLabel)
        ) {
            // Reset Multiple Consecutively Spaces
            this.numberOfConsecutivelySpaces = 0;

            // Reset One Space Only
            if (
                this.getSuperControl.value &&
                !this.getSuperControl.value?.includes(' ')
            ) {
                this.oneSpaceOnlyCounter = 0;
            }
        }

        if (
            this._inputConfig.isDropdown ||
            this._inputConfig.dropdownLabel ||
            this._inputConfig.name == 'Address'
        ) {
            if (event.keyCode === 40 || event.keyCode === 38) {
                this.dropDownKeyNavigationEvemt.emit({
                    keyCode: event.keyCode,
                    data: null,
                });
            }
            if (event.keyCode === 13) {
                this.dropDownKeyNavigationEvemt.emit({
                    keyCode: event.keyCode,
                    data: this._inputConfig,
                });

                if (this._inputConfig.name == 'Address') {
                    this.input.nativeElement.blur();
                }
            }
            if (event.keyCode === 27) {
                this.isVisibleCommands = false;
                this.onBlur();
                this.blurOnDropDownArrow();
                this.input.nativeElement.blur();
                this.dropDownKeyNavigationEvemt.emit({
                    keyCode: event.keyCode,
                    data: null,
                });
            }
            if (event.keyCode === 9) {
                this.onFocus();
                this.input.nativeElement.focus();
                this.dropDownKeyNavigationEvemt.emit({
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
                    this._inputConfig.maxLength
                ) {
                    this.input.nativeElement.value =
                        this.input.nativeElement.value.substring(
                            0,
                            this._inputConfig.maxLength
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

        switch (this._inputConfig.textTransform) {
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

        if (this._inputConfig.thousandSeparator && this.getSuperControl.value) {
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

        if (this._inputConfig.priceSeparator && this.getSuperControl.value) {
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
                    this._inputConfig.priceSeparatorLimitation + 3;

                // 4.2. Divide number on decimal and integer part
                let integerPart = this.thousandSeparatorPipe.transform(
                    this.getSuperControl.value
                        .slice(0, this.hasDecimalIndex)
                        .slice(0, this._inputConfig.priceSeparatorLimitation)
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
                        this._inputConfig.priceSeparatorLimitation;

                    // Cut value
                    if (this.getSuperControl.value) {
                        this.getSuperControl.patchValue(
                            this.getSuperControl.value.slice(
                                0,
                                this._inputConfig.priceSeparatorLimitation
                            )
                        );
                    }

                    // Transform value again after cutting
                    this.getSuperControl.patchValue(
                        this.thousandSeparatorPipe.transform(
                            this.getSuperControl.value
                        )
                    );
                }
            }

            if (this.getSuperControl.value) {
                this.timeoutCleaner = setTimeout(() => {
                    this.input.nativeElement.setSelectionRange(
                        this.cursorInputPosition +
                            (this.getSuperControl.value.indexOf('.') === -1
                                ? 1
                                : 0),
                        this.cursorInputPosition +
                            (this.getSuperControl.value.indexOf('.') === -1
                                ? 1
                                : 0)
                    );
                }, 0);
            } else {
                // if we have ${n}00000 and we delete N then we got undefined instead of dot
                this.getSuperControl.patchValue(0);
            }
        }

        /**
         *  Custom Validation For This Type of Input Below, DONT TOUCH !
         */

        if (['year'].includes(this._inputConfig.name.toLowerCase())) {
            if (
                parseInt(value) >
                parseInt(moment().add(1, 'year').format('YYYY'))
            ) {
                this.getSuperControl.setErrors({ invalid: true });
            }
        }

        if (['months'].includes(this._inputConfig.name.toLowerCase())) {
            if (parseInt(value) < 1 || parseInt(value) > 12) {
                this.getSuperControl.setErrors({ invalid: true });
            } else {
                this.getSuperControl.setErrors(null);
            }
        }

        if (['axles'].includes(this._inputConfig.name.toLowerCase())) {
            if (parseInt(value) <= 1 || parseInt(value) > 17) {
                if (parseInt(value) <= 1) {
                    this.getSuperControl.setErrors({ min: 2 });
                } else if (parseInt(value) > 17) {
                    this.getSuperControl.setErrors({ max: 17 });
               }
            } else {
                this.getSuperControl.setErrors(null);
            }
        }

        if (['full name'].includes(this._inputConfig.name.toLowerCase())) {
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
            ].includes(this._inputConfig.name.toLowerCase())
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

        if (['hos'].includes(this._inputConfig.name.toLowerCase())) {
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

        this.removeLeadingZero();
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

        if (this._inputConfig.priceSeparator) {
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
                const valueToString = String(this.getSuperControl.value);

                this.hasDecimalIndex = valueToString?.indexOf('.');

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
                        /*  integerPart + '.' + decimalPart */ 'asd'
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
            ].includes(this._inputConfig.name.toLowerCase())
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
                'bol no.',
                'seal no.',
                'pickup no.',
                'code',
                'multifromfirstfrom',
                'multifromfirstto',
                'multiformsecondfrom',
                'multiformsecondto',
                'multiformthirdfrom',
                'multiformthirdto',
            ].includes(this._inputConfig.name.toLowerCase())
        ) {
            // Only numbers
            if (this.inputService
                    .getInputRegexPattern('qty')
                    .test(String.fromCharCode(event.charCode))
            ) { 
                return true;
            }

            event.preventDefault();
            return false;
        }

        if (['email'].includes(this._inputConfig.name.toLowerCase())) {
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

        if (['invoice'].includes(this._inputConfig.name.toLowerCase())) {
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

        if (['address'].includes(this._inputConfig.name.toLowerCase())) {
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
                this._inputConfig.name.toLowerCase()
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

        if (['first name'].includes(this._inputConfig.name.toLowerCase())) {
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

        if (['last name'].includes(this._inputConfig.name.toLowerCase())) {
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

        if (['bank name'].includes(this._inputConfig.name.toLowerCase())) {
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
                this._inputConfig.name.toLowerCase()
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
                this._inputConfig.name.toLowerCase()
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

        if (['year'].includes(this._inputConfig.name.toLowerCase())) {
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

        if (['license plate'].includes(this._inputConfig.name.toLowerCase())) {
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

        if (['description'].includes(this._inputConfig.name.toLowerCase())) {
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

        if (['allow all'].includes(this._inputConfig.name.toLowerCase())) {
            if (/.*/.test(String.fromCharCode(event.charCode))) {
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['dba name'].includes(this._inputConfig.name.toLowerCase())) {
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

        if (['per mile'].includes(this._inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('per mile')
                    .test(String.fromCharCode(event.charCode))
            ) {
                this.disableMultiplePoints(event);

                // Check for max length
                if (this.getSuperControl.value?.toString().includes('.')) {
                    this._inputConfig.maxLength = 4;
                } else {
                    this._inputConfig.maxLength = 2;
                }

                // Check for range
                if (
                    this.getSuperControl.value > this._inputConfig.max ||
                    this.getSuperControl.value < this._inputConfig.min
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
                this._inputConfig.name.toLowerCase()
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
                            perStopValue > this._inputConfig.max ||
                            perStopValue < this._inputConfig.min
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
                this._inputConfig.name.toLowerCase()
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

        if (['emergency name'].includes(this._inputConfig.name.toLowerCase())) {
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

        if(['full contact name'].includes(this._inputConfig.name.toLowerCase())) {
            if (
                this.inputService
                    .getInputRegexPattern('full contact name')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return true;
            }
            event.preventDefault();
            return false;
        }

        if (['fuel-store'].includes(this._inputConfig.name.toLowerCase())) {
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

        if (['hos'].includes(this._inputConfig.name.toLowerCase())) {
            if (
                !this.inputSelection &&
                this.inputService
                    .getInputRegexPattern('hos')
                    .test(String.fromCharCode(event.charCode))
            ) {
                return (
                    this.getSuperControl.value * 10 + event.charCode - 48 <=
                    this._inputConfig.max
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
                this._inputConfig.name.toLowerCase()
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

        if (['cdl-number'].includes(this._inputConfig.name.toLowerCase())) {
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
                this._inputConfig.name.toLowerCase()
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

        if (['full name'].includes(this._inputConfig.name.toLowerCase())) {
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

        if (['tollvalidation'].includes(this._inputConfig.name.toLowerCase())) {
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
                this._inputConfig.name.toLowerCase()
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

        if (['file name'].includes(this._inputConfig.name.toLowerCase())) {
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
                this._inputConfig.name.toLowerCase()
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
                this._inputConfig.name.toLowerCase()
            )
        ) {
            this.disableConsecutivelySpaces(event);
            this.disableConsecutivelyPoints(event);
        }

        this.input.nativeElement.value.trim();
    }
    //-------------- end

    public onEditInput(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.editInputMode = true;
        this._inputConfig.dropdownLabelNew = false;
        if (!this._inputConfig.blueInput) this._inputConfig.blackInput = true;
        this._inputConfig.commands.active = true;
        this.isVisibleCommands = true;
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
                const value =
                    MethodsCalculationsHelper.convertThousanSepInNumber(
                        this.getSuperControl.value
                    );
                switch (action) {
                    case 'decrement': {
                        if (value >= 10000 && value < 20000) {
                            this.getSuperControl.patchValue(
                                MethodsCalculationsHelper.convertNumberInThousandSep(
                                    value - 1000
                                )
                            );
                        } else if (value >= 20001 && value < 50000) {
                            this.getSuperControl.patchValue(
                                MethodsCalculationsHelper.convertNumberInThousandSep(
                                    value - 3000
                                )
                            );
                        } else if (value >= 50001 && value < 100000) {
                            this.getSuperControl.patchValue(
                                MethodsCalculationsHelper.convertNumberInThousandSep(
                                    value - 5000
                                )
                            );
                        } else if (value >= 10000) {
                            this.getSuperControl.patchValue(
                                MethodsCalculationsHelper.convertNumberInThousandSep(
                                    value - 10000
                                )
                            );
                        } else if (value >= 1000) {
                            this.getSuperControl.patchValue(
                                MethodsCalculationsHelper.convertNumberInThousandSep(
                                    value - 500
                                )
                            );
                        }
                        break;
                    }
                    case 'increment': {
                        if (value > 10000 && value < 20000) {
                            this.getSuperControl.patchValue(
                                MethodsCalculationsHelper.convertNumberInThousandSep(
                                    value + 1000
                                )
                            );
                        } else if (value >= 20001 && value < 50000) {
                            this.getSuperControl.patchValue(
                                MethodsCalculationsHelper.convertNumberInThousandSep(
                                    value + 3000
                                )
                            );
                        } else if (value >= 50001 && value < 100000) {
                            this.getSuperControl.patchValue(
                                MethodsCalculationsHelper.convertNumberInThousandSep(
                                    value + 5000
                                )
                            );
                        } else if (value >= 10000) {
                            this.getSuperControl.patchValue(
                                MethodsCalculationsHelper.convertNumberInThousandSep(
                                    value + 10000
                                )
                            );
                        } else {
                            this.getSuperControl.patchValue(
                                MethodsCalculationsHelper.convertNumberInThousandSep(
                                    value + 500
                                )
                            );
                        }
                        break;
                    }
                    case 'reset': {
                        if (this._inputConfig?.defaultValue) {
                            this.getSuperControl.patchValue(
                                this._inputConfig?.defaultValue
                            );
                        }
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
                                !this._inputConfig.dropdownLabelNew &&
                                this._inputConfig.name !==
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
                this._inputConfig.dropdownLabelNew = false;
                this._inputConfig.commands.active = false;
                this._inputConfig.blackInput = false;
                this.editInputMode = false;
                this.isVisibleCommands = false;
                this.focusInput = false;

                break;
            }
            case 'months': {
                clearTimeout(this.inputCommandsTimeout);
                switch (action) {
                    case 'minus': {
                        if (
                            parseInt(this.getSuperControl.value) === 1 ||
                            !this.getSuperControl.value
                        ) {
                            this.blurOnCommands();
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
                            this.blurOnCommands();
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

    private blurOnCommands() {
        this.inputCommandsTimeout = setTimeout(() => {
            this._inputConfig.commands.active = false;
            this.isVisibleCommands = false;
            this._inputConfig.blackInput = false;
            this.refChange.detectChanges();
        }, 200);
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

    // Logic Validation Input
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
    // ------- end

    // Paste
    public onPaste(event?: any) {
        event.preventDefault();

        this.pasteCheck(
            event.clipboardData.getData('text'),
            this.inputService.getInputRegexPattern(
                this._inputConfig.name.toLowerCase()
            )
        );
    }

    private pasteCheck(pastedText: any, regexType?: RegExp) {
        let newText = '';
        let formatedText = '';
        let countOfCaracters = 0;

        // Max Length For Paste
        if (this._inputConfig.maxLength) {
            if (
                pastedText.startsWith('+1') ||
                (pastedText.startsWith('1') &&
                    this._inputConfig.name === 'Phone')
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

                if (countOfCaracters === this._inputConfig.maxLength) {
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
                this._inputConfig.name.toLowerCase()
            )
        ) {
            if ('phone' === this._inputConfig.name.toLowerCase()) {
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

            if ('ein' === this._inputConfig.name.toLowerCase()) {
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

            if ('ssn' === this._inputConfig.name.toLowerCase()) {
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
    // ------- end

    // Optimization for *ngFor
    public trackIdentity = (index: number): number => index;

    //-------------------------------------- Date & Time Picker --------------------------------------

    public setTimePickerTime() {
        if (this._inputConfig.name === 'timepicker')
            this.dateTimeInputDate = new Date(
                moment().format('MM/DD/YYYY') +
                    (this._inputConfig?.isFromDate ? ' 12:15' : ' 12:00')
            );
    }
    public setTimeDateInput(date) {
        let text, dateFormat, timeFormat;
        if (this._inputConfig.name === 'datepicker') {
            text = moment(new Date(date)).format('MM/DD/YY');
            dateFormat = text.split('/');
        } else if (this._inputConfig.name === 'datepickerBankCard') {
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

        if (this.span1) {
            this.span1.nativeElement.innerHTML = dateFormat[0];
        }

        if (this.span2) {
            if (this._inputConfig.name !== 'datepickerBankCard') {
                this.span2.nativeElement.innerHTML = dateFormat[1];
                this.span3.nativeElement.innerHTML = dateFormat[2];
            } else {
                this.span2.nativeElement.innerHTML = dateFormat[2];
            }
        }

        this.dateTimeInputDate = new Date(date);
        this.showDateInput = true;
    }

    public resetDateTimeInputs() {
        if (this.span1) {
            if (this._inputConfig.name === 'datepicker') {
                this.span1.nativeElement.innerHTML = 'mm';
                this.span2.nativeElement.innerHTML = 'dd';
                this.span3.nativeElement.innerHTML = 'yy';
            } else if (this._inputConfig.name === 'datepickerBankCard') {
                this.span1.nativeElement.innerHTML = 'mm';
                this.span2.nativeElement.innerHTML = 'yy';
            } else if (this._inputConfig.name === 'timepicker') {
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

    public selectionChange(event: any) {
        if (event) {
            this.inputSelection = true;
        }
    }

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
            (this.selectionInput == 3 &&
                this._inputConfig.name === 'timepicker')
        ) {
            !e.noPrevent && e.preventDefault();
            if (e.keyCode == 37) {
                if (this.selectionInput != 0) {
                    this.selectionInput = this.selectionInput - 1;
                    this.selectSpanByTabIndex(this.selectionInput, true);
                }
            } else if (e.keyCode == 39 || e.keyCode == 9) {
                if (
                    ((this._inputConfig.name === 'datepickerBankCard' &&
                        this.selectionInput != 1) ||
                        (this._inputConfig.name !== 'datepickerBankCard' &&
                            this.selectionInput != 2)) &&
                    !e.shiftKey
                ) {
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

        let span3Value;

        if (this._inputConfig.name !== 'datepickerBankCard') {
            span3Value =
                isNaN(this.span3.nativeElement.innerHTML) ||
                this.newInputChanged
                    ? ''
                    : parseInt(this.span3.nativeElement.innerHTML);
        }

        this.newInputChanged = false;
        if (this._inputConfig.name === 'datepicker') {
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
        } else if (this._inputConfig.name === 'datepickerBankCard') {
            if (!this.selectionInput) {
                if (isRestart) {
                    this.span1.nativeElement.innerHTML = 'mm';
                    this.selectionInput = 0;
                    this.selectSpanByTabIndex(0);
                } else if (span1Value) {
                    const final_value = parseInt(`${span1Value}${e.key}`);
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
            } else {
                if (isRestart) {
                    this.span2.nativeElement.innerHTML = 'yy';
                    this.selectionInput = 2;
                    this.selectSpanByTabIndex(2, true);
                } else if (!span2Value || span2Value.toString().length === 2) {
                    this.span2.nativeElement.innerHTML = (
                        '0' + parseInt(e.key)
                    ).slice(-2);
                    this.dateTimeInputDate = new Date(
                        this.dateTimeInputDate.setFullYear(
                            parseInt(`200${parseInt(e.key)}`)
                        )
                    );

                    this.selectSpanByTabIndex(1);
                } else {
                    const finalYear = parseInt(
                        this.span2.nativeElement.innerHTML + parseInt(e.key)
                    );

                    const finalShowYear =
                        finalYear > 31
                            ? parseInt(`19${finalYear}`)
                            : parseInt(`20${finalYear}`);
                    this.dateTimeInputDate = new Date(
                        this.dateTimeInputDate.setFullYear(finalShowYear)
                    );
                    this.span2.nativeElement.innerHTML = (
                        this.span2.nativeElement.innerHTML + parseInt(e.key)
                    ).slice(-2);
                    this.selectSpanByTabIndex(1);
                }
            }
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
        if (this._inputConfig.name === 'datepicker') {
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
                            this.dateTimeInputDate.getMonth() - 1
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
                            this.dateTimeInputDate.getDate() - 1
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
        } else if (this._inputConfig.name === 'datepickerBankCard') {
            if (direction === 'up') {
                if (!this.selectionInput) {
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
                } else {
                    this.dateTimeInputDate = new Date(
                        this.dateTimeInputDate.setFullYear(
                            this.dateTimeInputDate.getFullYear() + 1
                        )
                    );
                    this.span2.nativeElement.innerHTML = this.dateTimeInputDate
                        .getFullYear()
                        .toString()
                        .slice(-2);
                    this.setSpanSelection(this.span2.nativeElement);
                }
            } else {
                if (!this.selectionInput) {
                    this.dateTimeInputDate = new Date(
                        this.dateTimeInputDate.setMonth(
                            this.dateTimeInputDate.getMonth() - 1
                        )
                    );
                    this.span1.nativeElement.innerHTML = (
                        '0' +
                        (this.dateTimeInputDate.getMonth() + 1)
                    ).slice(-2);
                    this.setSpanSelection(this.span1.nativeElement);
                } else {
                    this.dateTimeInputDate = new Date(
                        this.dateTimeInputDate.setFullYear(
                            this.dateTimeInputDate.getFullYear() - 1
                        )
                    );
                    this.span2.nativeElement.innerHTML = this.dateTimeInputDate
                        .getFullYear()
                        .toString()
                        .slice(-2);
                    this.setSpanSelection(this.span2.nativeElement);
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
        if (!this._inputConfig.dropdownLabel) {
            this.focusInput = true;
            this.showDateInput = true;
        }
    }

    onPopoverHidden() {
        if (!this._inputConfig.dropdownLabel) {
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
            if (this._inputConfig.name === 'datepicker') {
                if (
                    !isNaN(this.span1?.nativeElement.innerHTML) &&
                    !isNaN(this.span2?.nativeElement.innerHTML) &&
                    !isNaN(this.span3?.nativeElement.innerHTML)
                ) {
                    if (
                        this._inputConfig.expiredDateInvalid &&
                        moment(this.dateTimeInputDate).isBefore(moment())
                    ) {
                        this.getSuperControl.setErrors({ invalid: true }); // don't accept expired dates
                    } else {
                        this.calendarService.dateChanged.next(
                            this.dateTimeInputDate
                        );
                    }
                } else {
                    this.span1.nativeElement.innerHTML = 'mm';
                    this.span2.nativeElement.innerHTML = 'dd';
                    this.span3.nativeElement.innerHTML = 'yy';
                    this.dateTimeInputDate = new Date();
                    this.showDateInput = false;
                }
            } else if (this._inputConfig.name === 'datepickerBankCard') {
                if (
                    !isNaN(this.span1.nativeElement.innerHTML) &&
                    !isNaN(this.span2.nativeElement.innerHTML)
                ) {
                    if (
                        this._inputConfig.expiredDateInvalid &&
                        moment(this.dateTimeInputDate).isBefore(moment())
                    ) {
                        this.getSuperControl.setErrors({ invalid: true }); // don't accept expired dates
                    } else {
                        this.calendarService.dateChanged.next(
                            this.dateTimeInputDate
                        );
                    }
                } else {
                    this.span1.nativeElement.innerHTML = 'mm';
                    this.span2.nativeElement.innerHTML = 'yy';
                    this.dateTimeInputDate = new Date();
                    this.showDateInput = false;
                }
            } else {
                if (
                    !isNaN(this.span1.nativeElement.innerHTML) &&
                    !isNaN(this.span2.nativeElement.innerHTML)
                ) {
                    // this.calendarService.dateChanged.next(
                    //     this.dateTimeInputDate
                    // );
                } else {
                    this.span1.nativeElement.innerHTML = 'HH';
                    this.span2.nativeElement.innerHTML = 'MM';
                    this.setTimePickerTime();
                    this.showDateInput = false;
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

            if (this._inputConfig.name !== 'datepickerBankCard') {
                range.setStart(this.span3.nativeElement, 1);
                range.setEnd(this.span3.nativeElement, 1);
            } else {
                range.setStart(this.span2.nativeElement, 1);
                range.setEnd(this.span2.nativeElement, 1);
            }

            selection.removeAllRanges();
            selection.addRange(range);
        }

        this.timeoutCleaner = setTimeout(() => {
            clearTimeout(this.dateTimeMainTimer);
            clearTimeout(this.focusBlur);
        }, 90);
    }

    selectLastOneAfterMoseUp() {
        if (this._inputConfig.name === 'datepickerBankCard') {
            this.selectionInput = 1;
            this.span2.nativeElement.focus();
            this.setSpanSelection(this.span2.nativeElement);
        } else {
            this.selectionInput = 2;
            this.span3.nativeElement.focus();
            this.setSpanSelection(this.span3.nativeElement);
        }

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
        clearTimeout(this.inputCommandsTimeout);
        clearTimeout(this.passwordTimeout);
    }
}
