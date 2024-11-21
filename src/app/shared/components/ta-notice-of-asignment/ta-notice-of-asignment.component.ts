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

// models
import { IFontSizeOption, ITextEditorToolbarAlignOption, ITextEditorToolbarConfig } from '@shared/components/ta-notice-of-asignment/models';

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
    @ViewChild('noticeRef', { static: true }) noticeRef: ElementRef;

    @Output() noticeFocus = new EventEmitter<any>();
    @Input() sidebarWidth: any;
    @Input() settings: any;
    
    public constants = TaNoticeOfAssignmentConstants;
    public svgRoutes = TaNoticeOfAsignmentSvgRoutes;

    public activeFont: IFontSizeOption = TaNoticeOfAssignmentConstants.FONT_SIZE_OPTION_DEFAULT;
    public activeFontSize: number = TaNoticeOfAssignmentConstants.FONT_SIZE_DEFAULT;
    public fontSizeOptions: IFontSizeOption[] = [...TaNoticeOfAssignmentConstants.FONT_SIZE_OPTIONS];
    public customSelectColor: string[] = TaNoticeOfAssignmentConstants.TOOLBAR_COLOR_OPTIONS;
    public selectedPaternColor: string = TaNoticeOfAssignmentConstants.TOOLBAR_RGB_COLOR_DEFAULT;
    public selectedColorName: string = TaNoticeOfAssignmentConstants.TOOLBAR_RGB_COLOR_DEFAULT;
    public toolbarActions: ITextEditorToolbarConfig = TaNoticeOfAssignmentConstants.TOOLBAR_ACTIONS_DEFAULT;
    public alignOptions: ITextEditorToolbarAlignOption[] = TaNoticeOfAssignmentConstants.TOOLBAR_ALIGN_OPTIONS_DEFAULT;
    public noticeForm: UntypedFormGroup;

    private isBlured: boolean = true;
    private showDropdown: boolean;
    private activeAlignment: string;
    private showCollorPattern: boolean;
    private value: string = TaNoticeOfAssignmentConstants.STRING_EMPTY;
    private isFormDirty: boolean = false;
    private destroy$ = new Subject<void>();
    private isDefaultColorSet: boolean;
    private slowTimeout: NodeJS.Timeout;
    private range: Range;
    private selectionTaken: Selection;

    constructor(
        @Self() public superControl: NgControl,
        private formBuilder: UntypedFormBuilder,
        private formService: FormService
    ) {
        this.superControl.valueAccessor = this;
    }
    writeValue(obj: any): void {
        // This is done to avoid reseting caret position by always setting innerHTML on text change
        if (this.noticeRef.nativeElement.innerHTML === TaNoticeOfAssignmentConstants.STRING_EMPTY) {
            this.noticeRef.nativeElement.innerHTML = obj;
        } else if (this.noticeRef.nativeElement.innerHTML === TaNoticeOfAssignmentConstants.HTML_ELEMENT_BR) {
            this.noticeRef.nativeElement.innerHTML = null;
            this.superControl.control.setValue(null);
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

    changeFontSize(event): void {
        this.activeFontSize = event.size;
        this.executeEditor(TaNoticeOfAssignmentConstants.TOOLBAR_ACTION_FONT_SIZE, event.size);
    }

    toggleDropdown(): void {
        this.showDropdown = !this.showDropdown;
    }

    public executeEditor(action: string, actionParam?: string): void {
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
                        if (this.value.replace(TaNoticeOfAssignmentConstants.HTML_ELEMENT_BR, TaNoticeOfAssignmentConstants.STRING_EMPTY) === TaNoticeOfAssignmentConstants.STRING_EMPTY) {
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
                        if (this.value.replace(TaNoticeOfAssignmentConstants.HTML_ELEMENT_BR, TaNoticeOfAssignmentConstants.STRING_EMPTY) === TaNoticeOfAssignmentConstants.STRING_EMPTY) {
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
                    this.isDefaultColorSet = true;
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
    
    public identifyAlignOption(item: ITextEditorToolbarAlignOption) {
        return item.name;
    }

    public identifyColor(index: number, item: string) {
        return item;
    }

    public onPaste(event: ClipboardEvent): void {
        CopyPasteHelper.onPaste(event);
    }

    private checkActiveItems(): void {
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

        if (this.isDefaultColorSet) {
            this.customSelectColor.map((col, indx) => {
                if (col == this.selectedPaternColor) {
                    this.selectedColorName = this.customSelectColor[indx];
                    document.execCommand('styleWithCSS', false, 'true');
                    setTimeout(() => {
                        this.focusElement();
                        setTimeout(() => {
                            this.focusElement();
                            this.selectedPaternColor = col;
                        });
                    });
                }
            });
        }
    }
}
