import { NoticeService } from 'src/app/core/services/shared/notice.service';
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
import {
    ControlValueAccessor,
    UntypedFormBuilder,
    UntypedFormGroup,
    NgControl,
    FormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from 'src/app/core/services/form/form.service';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ReactiveFormsModule } from '@angular/forms';
import { TaInputDropdownComponent } from '../ta-input-dropdown/ta-input-dropdown.component';

// helpers
import { CopyPasteHelper } from 'src/app/shared/utils/helpers/copy-paste.helper';

@Component({
    selector: 'app-ta-notice-of-asignment',
    templateUrl: './ta-notice-of-asignment.component.html',
    styleUrls: ['./ta-notice-of-asignment.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SafeHtmlPipe,
        AngularSvgIconModule,
        ReactiveFormsModule,
        TaInputDropdownComponent,
    ],
})
export class TaNoticeOfAsignmentComponent
    implements OnInit, ControlValueAccessor, OnDestroy
{
    @Output() noticeFocus = new EventEmitter<any>();
    @Input() sidebarWidth: any;
    range: any;
    @Input() settings: any;
    @Input() noticeValue: any;
    shownValue: string = '';
    selectedFontFamily = 3;
    selectedFontSize = 14;
    activeFont: any = { id: 3, name: 'Default', showName: 'Default' };
    activeFontSize: any;
    isBlured: boolean = true;

    fontSizeList: any[] = [
        {
            id: 1,
            name: 'Large',
            showName: 'Large',
            additionalText: 24,
        },
        {
            id: 2,
            name: 'Medium',
            showName: 'Medium',
            additionalText: 18,
        },
        {
            id: 3,
            name: 'Default',
            showName: 'Default',
            additionalText: 13,
        },
        {
            id: 4,
            name: 'Small',
            showName: 'Small',
            additionalText: 10,
        },
    ];

    showDropdown: boolean;
    customSelectColor: any[] = [
        'rgb(60, 60, 60)',
        'rgb(48, 116, 211)',
        'rgb(38, 166, 144)',
        'rgb(239, 83, 80)',
        'rgb(255, 167, 38)',
        'rgb(171, 71, 188)',
    ];
    activeOptions: any = {
        bold: false,
        italic: false,
        foreColor: false,
        underline: false,
        strikeThrough: false,
        fontSize: true,
    };

    alignOptions: any = [
        {
            name: 'justifyLeft',
            value: false,
            image: 'assets/svg/common/align-left-icon.svg',
        },
        {
            name: 'justifyCenter',
            value: false,
            image: 'assets/svg/common/align-center-icon.svg',
        },
        {
            name: 'justifyRight',
            value: false,
            image: 'assets/svg/common/align-right-icon.svg',
        },
        {
            name: 'justifyFull',
            value: false,
            image: 'assets/svg/common/align-full-icon.svg',
        },
    ];

    activeAlignment: string;

    selectionTaken: any;

    showCollorPattern: boolean;
    buttonsExpanded = false;
    isExpanded = false;
    editorDoc: any;
    value = '';

    isFormDirty: boolean = false;
    private destroy$ = new Subject<void>();
    public noticeForm: UntypedFormGroup;

    selectedPaternColor = 'rgb(60, 60, 60)';
    @ViewChild('noticeRef', { static: true }) noticeRef: ElementRef;
    selectedColorName: string = 'rgb(60, 60, 60)';
    defaultColorSet: any;
    slowTimeout: any;

    constructor(
        @Self() public superControl: NgControl,
        private noticeService: NoticeService,
        private elementRef: ElementRef,
        private formBuilder: UntypedFormBuilder,
        private formService: FormService
    ) {
        this.superControl.valueAccessor = this;
    }
    writeValue(obj: any): void {
        this.noticeRef.nativeElement.value = obj;
    }
    registerOnChange(_: any): void {}
    registerOnTouched(_: any): void {}
    setDisabledState?(_: boolean): void {}

    ngOnInit(): void {
        this.activeFont = { id: 3, name: 'Default', showName: 'Default' };
        this.activeFontSize = { id: 4, name: 14, showName: 14 };
        this.shownValue = this.noticeValue;
        this.createForm();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private createForm() {
        this.noticeForm = this.formBuilder.group({
            fontFamily: [null],
            fontSize: [null],
        });

        this.formService.checkFormChange(this.noticeForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    get getSuperControl() {
        return this.superControl.control;
    }

    selectFontFamily(e): void {
        this.noticeRef.nativeElement.focus();
        this.activeFont = e;
        this.executeEditor('fontName', e.name);
    }

    changeFontSize(e): void {
        this.activeFontSize = e.additionalText;
        this.executeEditor('fontSize', e.additionalText);
    }

    toggleDropdown(): void {
        this.showDropdown = !this.showDropdown;
    }

    executeEditor(action: string, color?: string) {
        document.execCommand('styleWithCSS', false, 'true');
        if (this.range) {
            this.selectionTaken.removeAllRanges();
            this.selectionTaken.addRange(this.range);
        }
        if (action !== 'foreColor') {
            if (action != 'fontSize') {
                this.showCollorPattern = false;
                if (
                    action == 'justifyLeft' ||
                    action == 'justifyRight' ||
                    action == 'justifyCenter' ||
                    action == 'justifyFull'
                ) {
                    this.activeAlignment = action;
                    let checkAlign = true;
                    this.alignOptions.map((align) => {
                        if (align.name != action) {
                            align.value = false;
                        } else {
                            align.value = !align.value;
                            checkAlign = align.value;
                        }
                    });

                    if (!checkAlign) {
                        if (this.value.replace('<br>', '') == '') {
                            this.selectionTaken.removeAllRanges();
                        }
                        document.execCommand('styleWithCSS', false, 'false');
                        document.execCommand(action, false, null);
                    } else {
                        this.focusElement();
                        document.execCommand(action, false, null);
                    }
                } else {
                    this.activeOptions[action] = !this.activeOptions[action];

                    if (!this.activeOptions[action]) {
                        if (this.value.replace('<br>', '') == '') {
                            this.selectionTaken.removeAllRanges();
                        }
                        document.execCommand('styleWithCSS', false, 'false');
                        document.execCommand(action, false, null);
                    } else {
                        this.focusElement();
                        document.execCommand(action, false, null);
                    }
                }
            } else {
                this.focusElement();
                const fontSize =
                    color == '10'
                        ? '1'
                        : color == '13'
                        ? '2'
                        : color == '18'
                        ? '4'
                        : '5';
                document.execCommand(action, false, fontSize);
            }
        } else {
            this.selectedColorName = color;
            setTimeout(() => {
                this.focusElement();
                setTimeout(() => {
                    this.focusElement();
                    this.selectedPaternColor = color;
                    this.defaultColorSet = true;
                    document.execCommand('foreColor', false, color);
                });
            });
        }

        setTimeout(() => {
            this.getSuperControl.patchValue(
                this.noticeRef.nativeElement.innerHTML
            );
        }, 500);
    }

    focusElement(): void {
        if (this.isBlured) {
            this.noticeFocus.emit(false);
        }

        if (this.noticeRef) {
            this.noticeRef.nativeElement.focus();
        }
    }

    checkActiveItems() {
        for (const act in this.activeOptions) {
            this.activeOptions[act] = document.queryCommandState(act);

            clearTimeout(this.slowTimeout);
            this.slowTimeout = setTimeout(() => {
                const findedColor = this.customSelectColor.find(
                    (item) => item == document.queryCommandValue('ForeColor')
                );
                this.selectedColorName = findedColor;
            }, 200);
            this.selectedPaternColor = document.queryCommandValue('ForeColor');
            this.activeFont =
                document.queryCommandValue('FontSize') == '1'
                    ? this.fontSizeList[3]
                    : document.queryCommandValue('FontSize') == '4'
                    ? this.fontSizeList[1]
                    : document.queryCommandValue('FontSize') == '5'
                    ? this.fontSizeList[0]
                    : this.fontSizeList[2];
        }

        this.alignOptions.map((align) => {
            align.value = document.queryCommandState(align.name);
        });

        if (this.defaultColorSet) {
            this.customSelectColor.map((col, indx) => {
                if (col.color == this.selectedPaternColor) {
                    this.selectedColorName = this.customSelectColor[indx];
                    document.execCommand('styleWithCSS', false, 'true');
                    setTimeout(() => {
                        this.focusElement();
                        setTimeout(() => {
                            this.focusElement();
                            this.selectedPaternColor = col.color;
                        });
                    });
                }
            });
        }
    }

    blurElement() {
        this.isBlured = !this.isBlured;
        this.noticeFocus.emit(this.isBlured);
        if (!this.isBlured) {
            this.selectionTaken = window.getSelection();
            if (
                this.selectionTaken.rangeCount &&
                this.selectionTaken.getRangeAt
            ) {
                this.range = this.selectionTaken.getRangeAt(0);
                this.selectionTaken.removeAllRanges();
                this.selectionTaken.addRange(this.range);
                this.noticeRef.nativeElement.blur();
            }
        }
    }

    updateNoteMain(e): void {
        this.checkActiveItems();
        this.getSuperControl.patchValue(e.target.innerHTML);
    }

    clickInsideContainer(): void {
        setTimeout(() => {
            this.checkActiveItems();
        }, 100);
    }

    public onPaste(event: ClipboardEvent): void {
        CopyPasteHelper.onPaste(event);
    }
}
