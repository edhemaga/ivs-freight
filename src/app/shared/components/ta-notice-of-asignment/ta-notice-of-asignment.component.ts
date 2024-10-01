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
    ReactiveFormsModule,
    NgControl,
    FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// services
import { FormService } from '@shared/services/form.service';

// pipes
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';

// helpers
import { CopyPasteHelper } from '@shared/utils/helpers/copy-paste.helper';

// interfaces
import { IFontSizeOption, ITextEditorToolbarAlignOption, ITextEditorToolbarConfig } from '@shared/components/ta-notice-of-asignment/interfaces';

// constants
import { TaNoticeOfAssignmentConstants } from '@shared/components/ta-notice-of-asignment/utils/constants';

// svg routes
import { TaNoticeOfAsignmentSvgRoutes } from '@shared/components/ta-notice-of-asignment/utils/svg-routes';

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
    public constants = TaNoticeOfAssignmentConstants;
    public svgRoutes = TaNoticeOfAsignmentSvgRoutes;
    @Output() noticeFocus = new EventEmitter<any>();
    @Input() sidebarWidth: any;
    range: any;
    @Input() settings: any;
    selectedFontFamily = 3;
    selectedFontSize = 14;
    activeFont: IFontSizeOption = { id: 2, name: 'Default', showName: 'Default', size: 13 };
    activeFontSize: number = TaNoticeOfAssignmentConstants.FONT_SIZE_DEFAULT;
    isBlured: boolean = true;
    fontSizeOptions: IFontSizeOption[] = [...TaNoticeOfAssignmentConstants.FONT_SIZE_OPTIONS];

    showDropdown: boolean;
    customSelectColor: any[] = [
        'rgb(60, 60, 60)',
        'rgb(48, 116, 211)',
        'rgb(38, 166, 144)',
        'rgb(239, 83, 80)',
        'rgb(255, 167, 38)',
        'rgb(171, 71, 188)',
    ];

    public toolbarActions: ITextEditorToolbarConfig = {
        fontSize: true,
        bold: false,
        italic: false,
        foreColor: false,
        underline: false,
        strikeThrough: false
    }

    public alignOptions: ITextEditorToolbarAlignOption[] = [
        {
            name: TaNoticeOfAssignmentConstants.TEXT_ALIGN_LEFT,
            value: false,
            imageUrl: TaNoticeOfAsignmentSvgRoutes.ICON_TEXT_ALIGN_LEFT_SVG_ROUTE,
        },
        {
            name: TaNoticeOfAssignmentConstants.TEXT_ALIGN_CENTER,
            value: false,
            imageUrl: TaNoticeOfAsignmentSvgRoutes.ICON_TEXT_ALIGN_CENTER_SVG_ROUTE,
        },
        {
            name: TaNoticeOfAssignmentConstants.TEXT_ALIGN_RIGHT,
            value: false,
            imageUrl: TaNoticeOfAsignmentSvgRoutes.ICON_TEXT_ALIGN_RIGHT_SVG_ROUTE,
        },
        {
            name: TaNoticeOfAssignmentConstants.TEXT_ALIGN_FULL,
            value: false,
            imageUrl: TaNoticeOfAsignmentSvgRoutes.ICON_TEXT_ALIGN_FULL_SVG_ROUTE,
        }
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
        private formBuilder: UntypedFormBuilder,
        private formService: FormService
    ) {
        this.superControl.valueAccessor = this;
    }
    writeValue(obj: any): void {
        // This is done to avoid reseting caret position by always setting innerHTML on text change
        if (this.noticeRef.nativeElement.innerHTML == '') {
            this.noticeRef.nativeElement.innerHTML = obj;
        } else {
            this.noticeRef.nativeElement.value = obj;
        }
    }
    registerOnChange(_: any): void {}
    registerOnTouched(_: any): void {}
    setDisabledState?(_: boolean): void {}

    ngOnInit(): void {
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
        this.activeFontSize = e.size;
        this.executeEditor(TaNoticeOfAssignmentConstants.TOOLBAR_ACTION_FONT_SIZE, e.size);
    }

    toggleDropdown(): void {
        this.showDropdown = !this.showDropdown;
    }

    executeEditor(action: string, actionParam?: string) {
        document.execCommand('styleWithCSS', false, 'true');
        if (this.range) {
            this.selectionTaken.removeAllRanges();
            this.selectionTaken.addRange(this.range);
        }
        if (action !== TaNoticeOfAssignmentConstants.TOOLBAR_ACTION_FORE_COLOR) {
            if (action != TaNoticeOfAssignmentConstants.TOOLBAR_ACTION_FONT_SIZE) {
                this.showCollorPattern = false;
                if (
                    action == TaNoticeOfAssignmentConstants.TEXT_ALIGN_LEFT ||
                    action == TaNoticeOfAssignmentConstants.TEXT_ALIGN_RIGHT ||
                    action == TaNoticeOfAssignmentConstants.TEXT_ALIGN_CENTER ||
                    action == TaNoticeOfAssignmentConstants.TEXT_ALIGN_FULL
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
                    this.toolbarActions[action] = !this.toolbarActions[action];

                    if (!this.toolbarActions[action]) {
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
                    actionParam == '10'
                        ? '1'
                        : actionParam == '13'
                        ? '2'
                        : '4';
                document.execCommand(action, false, fontSize);
            }
        } else {
            this.selectedColorName = actionParam;
            setTimeout(() => {
                this.focusElement();
                setTimeout(() => {
                    this.focusElement();
                    this.selectedPaternColor = actionParam;
                    this.defaultColorSet = true;
                    document.execCommand(TaNoticeOfAssignmentConstants.TOOLBAR_ACTION_FORE_COLOR, false, actionParam);
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
        for (const action in this.toolbarActions) {
            this.toolbarActions[action] = document.queryCommandState(action);

            clearTimeout(this.slowTimeout);
            this.slowTimeout = setTimeout(() => {
                const findedColor = this.customSelectColor.find(
                    (item) => item == document.queryCommandValue(TaNoticeOfAssignmentConstants.TOOLBAR_ACTION_FORE_COLOR)
                );
                this.selectedColorName = findedColor;
            }, 200);
            this.selectedPaternColor = document.queryCommandValue(TaNoticeOfAssignmentConstants.TOOLBAR_ACTION_FORE_COLOR);
            this.activeFont =
                document.queryCommandValue(TaNoticeOfAssignmentConstants.TOOLBAR_ACTION_FONT_SIZE) == '1'
                    ? this.fontSizeOptions[2]
                    : document.queryCommandValue(TaNoticeOfAssignmentConstants.TOOLBAR_ACTION_FONT_SIZE) == '5'
                    ? this.fontSizeOptions[0]
                    : this.fontSizeOptions[1];
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
