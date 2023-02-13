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
    range: any;
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
        fontSize: true,
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

    selectedPaternColor = '#3C3C3C';
    @ViewChild('noticeRef', { static: true }) noticeRef: ElementRef;
    selectedColorName: string = '#3C3C3C';
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
            } else {
                this.focusElement();
                document.execCommand(action, false, `${color}px`);
            }
        } else {
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
    }

    focusElement(): void {
        if (this.noticeRef) {
            this.noticeRef.nativeElement.focus();
        }
    }

    changeFontSize5(event) {
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

    checkActiveItems() {
        for (const act in this.activeOptions) {
            this.activeOptions[act] = document.queryCommandState(act);

            clearTimeout(this.slowTimeout);
            this.slowTimeout = setTimeout(() => {
                const findedColor = this.customSelectColor.find(
                    (item) =>
                        item == document.queryCommandValue('ForeColor')
                );
                this.selectedColorName = findedColor;
                console.log(this.selectedColorName, 'selcolorname')
            }, 200);
            this.selectedPaternColor = document.queryCommandValue('ForeColor');
        }

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
        this.selectionTaken = window.getSelection();
        if (this.selectionTaken.rangeCount && this.selectionTaken.getRangeAt) {
            this.range = this.selectionTaken.getRangeAt(0);
            this.selectionTaken.removeAllRanges();
            this.selectionTaken.addRange(this.range);
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

    @HostListener('document:click', ['$event.target'])
    public onClick(target) {
        // const clickedInside = this.elementRef.nativeElement.contains(target);
        // if (clickedInside) {
        //     const selectionTaken = window.getSelection();
        //     if (selectionTaken.rangeCount && selectionTaken.getRangeAt) {
        //         const range = selectionTaken.getRangeAt(0);
        //         if (this.range) {
        //             selectionTaken.removeAllRanges();
        //             selectionTaken.addRange(this.range);
        //         }
        //     }
        //}
    }
}
