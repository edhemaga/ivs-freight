import {
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
import { FormControl } from '@angular/forms';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { TaInputComponent } from '../../ta-input/ta-input.component';
import { TaInputService } from '../../ta-input/ta-input.service';
import { UrlExtensionPipe } from 'src/app/core/pipes/url-extension.pipe';

export interface UploadFile {
    fileName: string;
    url: string | any;
    extension?: string;
    guid?: string;
    size?: number | string;
    tags?: any;
    realFile?: File;
    tagId?: any;
}
@Component({
    selector: 'app-ta-upload-file',
    templateUrl: './ta-upload-file.component.html',
    styleUrls: ['./ta-upload-file.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [UrlExtensionPipe],
})
export class TaUploadFileComponent implements OnInit, OnDestroy {
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

    // Review
    @Input() isReview: boolean;
    @Input() reviewMode: string;
    @Input() feedbackText: string;
    @Input() categoryTag: string;

    public documentReviewInputControl: FormControl = new FormControl(null);
    public documentReviewInputVisible: boolean = false;
    @Output() documentReviewInputEvent: EventEmitter<{
        file: UploadFile;
        message: string;
    }> = new EventEmitter<{ file: UploadFile; message: string }>(null);

    public editFile: boolean = false;
    public fileNewName: FormControl = new FormControl();
    public numberOfFilePages: string = '0';

    public isFileDelete: boolean = false;

    public isIncorrectMarkHover: boolean = false;
    public fileExtension: string;
    @ViewChild('t2') t2: any;

    @Output() landscapeCheck = new EventEmitter();

    constructor(
        private inputService: TaInputService,
        private urlExt: UrlExtensionPipe,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.inputService.onFocusOutInput$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.editFile = false;
                    if (this.fileNewName.value) {
                        this.file.fileName = this.fileNewName.value;
                        // this.file.fileName =
                        //   this.fileNewName.value[0].toUpperCase() +
                        //   this.fileAction.emit({ file: this.file, action: 'edit' });
                    }
                }
            });

        if (this.isReview) {
            this.reviewInputControlChange();
        }

        if (!this.file?.extension) {
            this.fileExtension = this.urlExt.transform(this.file.url);
        }
    }

    ngAfterViewInit(): void {
        this.setTags();
        if(this.file.tags?.length) {
            this.categoryTag = this.file.tags[0];
        }
    }

    public afterLoadComplete(pdf: PDFDocumentProxy) {
        this.numberOfFilePages =
            pdf._pdfInfo.numPages === 1
                ? pdf._pdfInfo.numPages.toString().concat(' ', 'PAGE')
                : pdf._pdfInfo.numPages.toString().concat(' ', 'PAGES');
    }

    public pageRendered(pdf){
        if(this.hasLandscapeOption && pdf.pageNumber == 1 && pdf.source.width > pdf.source.height) {
            this.landscapeCheck.emit(true);
        }
    }

    public onAction(action: string) {
        switch (action) {
            case 'tag': {
                if (this.file.tags) {
                    this.selectTag(this.file.tags);
                } else {
                    this.selectTag('No Tag');
                }

                this.t2.open();
                //this.fileAction.emit({ file: this.file, action });
                break;
            }
            case 'download': {
                this.downloadFile(this.file.url, this.file.fileName);
                break;
            }
            case 'delete': {
                this.isFileDelete = false;
                this.fileAction.emit({ file: this.file, action });
                break;
            }
            case 'cancel': {
                this.isFileDelete = false;
                break;
            }
            case 'mark-incorrect': {
                this.fileAction.emit({ file: this.file, action });
                break;
            }
            case 'mark-correct': {
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
        if (this.customClassName !== 'driver-details-pdf' && this.customClassName !== 'landscape-details-view' && this.reviewMode != 'REVIEW_MODE' && !this.inputRef?.focusInput) {
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
            this.tags.map((item, i)=>{
                item = {
                    ...item,
                    checked: false
                };

                this.tagsOptions.push(item);
            });
        }
    }

    public selectTag(tag: string) {
        this.tagsOptions.map((item) => {
            if (item.tagName == tag) {
                item.checked = true;

                setTimeout(()=>{
                    this.file.tags = item.tagName;
                    this.file.tagId = [item.tagId];
                    this.ref.detectChanges();
                }, 200);
            } else {
                item.checked = false;
            }
        });
        this.ref.detectChanges();
    }

    public removeTag() {
        setTimeout(()=>{
            this.file.tags = null;
            this.file.tagId = [];
            this.ref.detectChanges();
        }, 200);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
