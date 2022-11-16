import {
  ChangeDetectionStrategy,
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
import {
  Subject,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { TaInputComponent } from '../../ta-input/ta-input.component';
import { TaInputService } from '../../ta-input/ta-input.service';
import { UrlExtensionPipe } from 'src/app/core/pipes/url-extension.pipe';

export interface UploadFile {
  fileName: string;
  url: string | any;
  extension?: string;
  guid?: string;
  size?: number | string;
  tag?: string;
  realFile?: File;
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
  @Input() hasTag: boolean = false;
  @Input() hasNumberOfPages: boolean = false;
  @Input() activePage: number = 1;
  @Input() tags: any[] = [];
  @Input() type: string; // modal | table | details

  @Output() fileAction: EventEmitter<{ file: UploadFile; action: string }> =
    new EventEmitter<{ file: UploadFile; action: string }>(null);

  // Review
  @Input() isReview: boolean;
  @Input() reviewMode: string;
  @Input() feedbackText: string;

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

  constructor(
    private inputService: TaInputService,
    private urlExt: UrlExtensionPipe,
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

  public afterLoadComplete(pdf: PDFDocumentProxy) {
    this.numberOfFilePages =
      pdf._pdfInfo.numPages === 1
        ? pdf._pdfInfo.numPages.toString().concat(' ', 'PAGE')
        : pdf._pdfInfo.numPages.toString().concat(' ', 'PAGES');
  }

  public onAction(action: string) {
    switch (action) {
      case 'tag': {
        if (this.file.tag) {
          this.selectTag(this.file.tag);
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
    if (this.customClassName !== 'driver-details-pdf') {
      this.editFile = true;
      this.fileNewName.patchValue(this.file.fileName);
      const timeout = setTimeout(() => {
        this.inputRef.setInputCursorAtTheEnd(this.inputRef.input.nativeElement);
        clearTimeout(timeout);
      }, 300);
    }
  }

  private reviewInputControlChange() {
    this.documentReviewInputControl.valueChanges
      .pipe(debounceTime(1500), distinctUntilChanged())
      .subscribe((value) => {
        this.documentReviewInputEvent.emit({ file: this.file, message: value });
      });
  }

  public getAnnotationReviewEvent(event: any) {
    this.documentReviewInputVisible = event.type === 'open';
  }

  public selectTag(tag: string) {
    this.tags.map((item) => {
      if (item.name == tag) {
        item.checked = true;
        if (item.name == 'No Tag') {
          this.file.tag = null;
        } else {
          this.file.tag = item.name;
        }
      } else {
        item.checked = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
