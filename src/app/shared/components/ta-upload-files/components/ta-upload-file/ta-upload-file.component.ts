import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    UntypedFormControl,
    ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

// bootstrap
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

// pdf-viewer
import { PDFDocumentProxy, PdfViewerModule } from 'ng2-pdf-viewer';

// components
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaSpinnerComponent } from '@shared/components/ta-spinner/ta-spinner.component';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { DetailsDataService } from '@shared/services/details-data.service';

// pipes
import { UrlExtensionPipe } from '@shared/components/ta-upload-files/pipes/url-extension.pipe';
import { ByteConvertPipe } from '@shared/components/ta-upload-files/pipes/byte-convert.pipe';

// icon
import { AngularSvgIconModule } from 'angular-svg-icon';

// models
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';

// enums
import { eGeneralActions } from '@shared/enums';

@Component({
    selector: 'app-ta-upload-file',
    templateUrl: './ta-upload-file.component.html',
    styleUrls: ['./ta-upload-file.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UrlExtensionPipe],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TaAppTooltipV2Component,
        ReactiveFormsModule,
        PdfViewerModule,
        ByteConvertPipe,
        NgbModule,
        UrlExtensionPipe,
        AngularSvgIconModule,
        TaSpinnerComponent,
        NgbPopoverModule,
        TaInputComponent,
    ],
})
export class TaUploadFileComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @ViewChild(TaInputComponent) inputRef: TaInputComponent;
    @Input() customClassName: string;
    @Input() file: UploadFile;
    @Input() hasTagsDropdown: boolean = false;
    @Input() hasNumberOfPages: boolean = false;
    @Input() activePage: number = 1;
    @Input() tags: any[] = [];
    @Input() type: string; // modal | table | details
    @Input() hasLandscapeOption: boolean = false;
    @Input() tagsOptions: any[] = [];

    @Output() fileAction: EventEmitter<{ file: UploadFile; action: string }> =
        new EventEmitter<{ file: UploadFile; action: string }>(null);

    @Output() fileHover: EventEmitter<{}> = new EventEmitter<{}>(null);

    // Review
    @Input() isReview: boolean;
    @Input() reviewMode: string;
    @Input() feedbackText: string;
    @Input() categoryTag: string;
    @Input() isFooterHidden: boolean = false;
    @Input() isActionsHidden: boolean = false;

    public documentReviewInputControl: UntypedFormControl =
        new UntypedFormControl(null);
    public documentReviewInputVisible: boolean = false;
    @Output() documentReviewInputEvent: EventEmitter<{
        file: UploadFile;
        message: string;
    }> = new EventEmitter<{ file: UploadFile; message: string }>(null);

    public editFile: boolean = false;
    public fileNewName: UntypedFormControl = new UntypedFormControl();
    public numberOfFilePages: string;

    public isFileDelete: boolean = false;

    public isIncorrectMarkHover: boolean = false;
    public fileExtension: string;
    public annotationHover: boolean = false;
    public documentLoading: boolean = true;
    public isArrowHovered: boolean = false;
    @ViewChild('t2') t2: any;

    @Output() landscapeCheck = new EventEmitter();

    constructor(
        private inputService: TaInputService,
        private urlExt: UrlExtensionPipe,
        private ref: ChangeDetectorRef,
        private detailsDataService: DetailsDataService
    ) {}

    ngOnInit(): void {
        if (!this.file?.realFile) {
            let setName = '';
            const name = this.file.fileName
                ? this.file.fileName.split('')
                : this.file.name
                  ? this.file.name.split('')
                  : '';
            name.map((item, i) => {
                if (i < name.length - 4) {
                    setName = setName + item;
                }
            });
            //this.file.fileName = setName;
        }

        if (this.isReview) {
            this.reviewInputControlChange();
        }

        if (!this.file?.extension) {
            this.fileExtension = this.urlExt.transform(this.file.url);
            if (this.fileExtension != 'pdf') {
                this.documentLoading = false;
            }
        } else if (this.file?.extension && this.file?.extension != 'pdf') {
            this.documentLoading = false;
        }

        if (this.file?.tags?.length && this.hasTagsDropdown) {
            this.file.savedTag = this.file.tags[0];
        }
    }

    ngAfterViewInit(): void {
        this.setTags();
        if (this.file.tags?.length) {
            this.categoryTag = this.file.tags[0];
        }
    }

    public onBlurInput(event: boolean) {
        if (event) {
            this.editFile = false;
            if (this.fileNewName.value) {
                this.file.fileName = this.fileNewName.value;
                // this.file.fileName =
                //   this.fileNewName.value[0].toUpperCase() +
                //   this.fileAction.emit({ file: this.file, action: eGeneralActions.EDIT_LOWERCASE });
            }
        }
    }

    public afterLoadComplete(pdf: PDFDocumentProxy) {
        this.documentLoading = false;
        this.numberOfFilePages =
            pdf._pdfInfo.numPages === 1
                ? pdf._pdfInfo.numPages.toString().concat(' ', 'PAGE')
                : pdf._pdfInfo.numPages.toString().concat(' ', 'PAGES');

        if (!this.file?.extension) {
            this.fileExtension = this.urlExt.transform(this.file.url);
        }
    }

    public pageRendered(pdf) {
        if (
            this.hasLandscapeOption &&
            pdf.pageNumber == 1 &&
            pdf.source.width > pdf.source.height
        ) {
            this.landscapeCheck.emit(true);
        }
    }

    public onAction(action: string) {
        this.detailsDataService.setDocumentName(this.file.fileName);
        switch (action) {
            case 'tag': {
                if (this.file.tags) {
                    this.selectTag(this.file.tags);
                } else {
                    this.selectTag('No Tag');
                }

                this.t2.open();
                break;
            }
            case 'download': {
                this.downloadFile(this.file.url, this.file.fileName);
                break;
            }
            case eGeneralActions.DELETE_LOWERCASE: {
                this.isFileDelete = false;
                this.fileAction.emit({ file: this.file, action });
                break;
            }
            case eGeneralActions.CANCEL: {
                this.isFileDelete = false;
                break;
            }
            case 'mark-incorrect': {
                this.file.incorrect = true;
                this.fileAction.emit({ file: this.file, action });
                break;
            }
            case 'mark-correct': {
                this.file.incorrect = false;
                this.fileAction.emit({ file: this.file, action });
                this.documentReviewInputVisible = false;
                break;
            }
            default: {
                break;
            }
        }
    }

    public downloadFile(url: string, filename: string) {
        fetch(url).then((t) => {
            return t.blob().then((b) => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(b);
                a.setAttribute('download', filename);
                a.click();
            });
        });
    }

    public onEditFile() {
        if (
            this.customClassName !== 'driver-details-pdf' &&
            this.customClassName !== 'landscape-details-view' &&
            this.reviewMode != 'REVIEW_MODE' &&
            !this.inputRef?.focusInput
        ) {
            this.editFile = true;
            this.fileNewName.patchValue(this.file.fileName);
            const timeout = setTimeout(() => {
                const input = this.inputRef.input.nativeElement;
                const selectionEnd = input.selection;
                if (input.setSelectionRange) {
                    input.setSelectionRange(selectionEnd, selectionEnd);
                }
                const focusTimeout = setTimeout(() => {
                    input.focus();
                    clearTimeout(focusTimeout);
                }, 120);
                clearTimeout(timeout);
            }, 300);
        }
    }

    private reviewInputControlChange() {
        this.documentReviewInputControl.valueChanges
            .pipe(debounceTime(1500), distinctUntilChanged())
            .subscribe((value) => {
                this.documentReviewInputEvent.emit({
                    file: this.file,
                    message: value,
                });
            });
    }

    public getAnnotationReviewEvent(event: any) {
        this.documentReviewInputVisible = event.type === 'open';
    }

    public setTags() {
        if (this.hasTagsDropdown && this.tags?.length) {
            this.tags.map((item) => {
                item = {
                    ...item,
                    checked: false,
                };

                this.tagsOptions.push(item);
            });
        }
    }

    public selectTag(tag: string) {
        this.tagsOptions.map((item) => {
            if (item.tagName == tag) {
                item.checked = true;

                setTimeout(() => {
                    this.file.tags = item.tagName;
                    this.file.tagGeneratedByUser = true;
                    this.file.tagId = [item.tagId];
                    this.file.tagChanged =
                        this.file.savedTag != item.tagName ? true : false;
                    const action = 'tag';
                    if (!this.t2.isOpen()) {
                        this.fileAction.emit({ file: this.file, action });
                    }
                    this.ref.detectChanges();
                }, 200);
            } else {
                item.checked = false;
            }
        });
        this.ref.detectChanges();
    }

    public removeTag() {
        setTimeout(() => {
            this.file.tags = null;
            this.file.tagId = [];
            const action = 'tag';
            this.file.tagChanged = this.file.savedTag ? true : false;
            this.fileAction.emit({ file: this.file, action });
            this.ref.detectChanges();
        }, 200);
    }

    public openDeletePopup(name) {
        this.detailsDataService.setDocumentName(name);
        this.isFileDelete = true;
    }

    public hoverFile() {
        this.fileHover.emit(this.file);
    }

    public updateHover(mod: boolean) {
        this.file.lastHovered = mod;
        this.ref.detectChanges();
    }

    public hoverArrow(mod: boolean) {
        this.isArrowHovered = mod;
        this.ref.detectChanges();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
