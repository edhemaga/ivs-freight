import { NoticeService } from 'src/app/core/services/shared/notice.service';
import {
    Component,
    ElementRef,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Self,
    ViewChild,
} from '@angular/core';
import {
    ControlValueAccessor,
    UntypedFormBuilder,
    UntypedFormGroup,
    NgControl,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from 'src/app/core/services/form/form.service';

@Component({
    selector: 'app-ta-notice-of-asignment',
    templateUrl: './ta-notice-of-asignment.component.html',
    styleUrls: ['./ta-notice-of-asignment.component.scss'],
})
export class TaNoticeOfAsignmentComponent
    implements OnInit, ControlValueAccessor, OnDestroy
{
    @Input() sidebarWidth: any;
    @Input() range: any;
    @Input() settings: any;
    @Input() noticeValue: any;
    shownValue: string = '';
    selectedFontFamily = 3;
    selectedFontSize = 14;
    activeFont: any = { id: 3, name: 'Default', showName: 'Default' };
    activeFontSize: any;

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
            additionalText: 17,
        },
        {
            id: 3,
            name: 'Default',
            showName: 'Default',
            additionalText: 14,
        },
        {
            id: 4,
            name: 'Small',
            showName: 'Small',
            additionalText: 11,
        },
    ];

    showDropdown: boolean;
    customSelectColor: any[] = [
        '#3C3C3C',
        '#3074D3',
        '#26A690',
        '#EF5350',
        '#FFA726',
        '#AB47BC',
    ];
    activeOptions: any = {
        bold: false,
        italic: false,
        foreColor: false,
        underline: false,
        strikeThrough: false,
    };

    selectionTaken: any;

    showCollorPattern: boolean;
    buttonsExpanded = false;
    isExpanded = false;
    editorDoc: any;
    value = '';

    isFormDirty: boolean = false;
    private destroy$ = new Subject<void>();
    public noticeForm: UntypedFormGroup;

    selectedPaternColor = '#919191';
    @ViewChild('noticeRef', { static: true }) noticeRef: ElementRef;

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
    registerOnChange(fn: any): void {}
    registerOnTouched(fn: any): void {}
    setDisabledState?(isDisabled: boolean): void {}

    ngOnInit(): void {
        this.activeFont = { id: 3, name: 'Default', showName: 'Default' };
        this.activeFontSize = { id: 4, name: 14, showName: 14 };
        this.createForm();
    }

    ngAfterViewInit(): void {
        this.shownValue = this.noticeValue;
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

    selectAligment(e): void {
        this.activeFontSize = e;
        this.executeEditor(e.name);
    }

    toggleDropdown(): void {
        this.showDropdown = !this.showDropdown;
    }

    changeTextColor(ind: number): void {
        const color = this.customSelectColor[ind];
        this.executeEditor('foreColor', color);
        this.toggleDropdown();
    }

    executeEditor(action: string, color?: string) {
        this.selectionTaken = window.getSelection();
        document.execCommand('styleWithCSS', false, 'true');
        if (this.range) {
            this.selectionTaken.removeAllRanges();
            this.selectionTaken.addRange(this.range);
        }
        if (action !== 'foreColor' && action !== 'fontName') {
            this.showCollorPattern = false;
            this.activeOptions[action] = !this.activeOptions[action];
            if (!this.activeOptions[action]) {
                if (this.value.replace('<br>', '') == '') {
                    this.selectionTaken.removeAllRanges();
                }
                document.execCommand('styleWithCSS', false, 'false');
                document.execCommand(action, false, null);
            } else {
                if (this.noticeRef) {
                    this.noticeRef.nativeElement.focus();
                }
                document.execCommand(action, false, null);
            }
        } else if (action == 'foreColor') {
            setTimeout(() => {
                if (this.noticeRef?.nativeElement) {
                    this.noticeRef.nativeElement.focus();
                }
                setTimeout(() => {
                    if (this.noticeRef?.nativeElement) {
                        this.noticeRef.nativeElement.focus();
                    }
                    this.selectedPaternColor = color;
                    document.execCommand('foreColor', false, color);
                });
            });
        } else if (action == 'fontName') {
            document.execCommand(action, false, color);
        }

        this.checkActiveItems();
        setTimeout(() => {
            this.noticeService.updateField.next();
        }, 500);
    }

    changeFontSize(event) {
        const fontSize = event.additionalText;
        document.execCommand('fontSize', false, '7');
        const fontElements =
            this.noticeRef.nativeElement.getElementsByTagName('font');
        for (let i = 0, len = fontElements.length; i < len; ++i) {
            if (
                fontElements[i].fontSize == '7' ||
                fontElements[i].fontSize == 'xxx-large'
            ) {
                fontElements[i].removeAttribute('size');
                fontElements[i].style.fontSize = `${fontSize}px`;
            }
        }
        const spanElements =
            this.noticeRef.nativeElement.getElementsByTagName('span');
        for (let i = 0; i < spanElements.length; ++i) {
            if (spanElements[i].style.fontSize == 'xxx-large') {
                spanElements[i].style.fontSize = `${fontSize}px`;
            }
        }

        this.noticeService.updateField.next();
    }

    public checkActiveItems() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            for (const act in this.activeOptions) {
                this.activeOptions[act] = document.queryCommandState(act);
                this.selectedPaternColor =
                    document.queryCommandValue('ForeColor');
            }
        }
    }

    blurElement() {
        const selectionTaken = window.getSelection();
        if (selectionTaken.rangeCount && selectionTaken.getRangeAt) {
            this.range = selectionTaken.getRangeAt(0);
        }
    }

    focusElement(e): void {
        setTimeout(() => {
            this.checkActiveItems();
        }, 100);
        this.noticeRef.nativeElement = e.target;
    }

    updateNoteMain(e): void {
        this.checkActiveItems();
        console.log(this.getSuperControl, 'updatenotice');
        this.getSuperControl.patchValue(e.target.innerHTML);
    }

    clickInsideContainer(): void {
        setTimeout(() => {
            this.checkActiveItems();
        }, 100);
    }

    @HostListener('document:click', ['$event.target'])
    public onClick(target) {
        const clickedInside = this.elementRef.nativeElement.contains(target);
        if (clickedInside) {
            const selectionTaken = window.getSelection();
            if (selectionTaken.rangeCount && selectionTaken.getRangeAt) {
                const range = selectionTaken.getRangeAt(0);
                if (this.range) {
                    selectionTaken.removeAllRanges();
                    selectionTaken.addRange(this.range);
                }
            }
        }
    }
}
