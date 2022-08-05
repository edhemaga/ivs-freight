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
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TaInputComponent } from '../../ta-input/ta-input.component';
import { TaInputService } from '../../ta-input/ta-input.service';

export interface UploadFile {
  name: string;
  url: string | any;
  extension?: string;
  guid?: string;
  size?: number | string;
  tag?: string;
}
@UntilDestroy()
@Component({
  selector: 'app-ta-upload-file',
  templateUrl: './ta-upload-file.component.html',
  styleUrls: ['./ta-upload-file.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaUploadFileComponent implements OnInit, OnDestroy {
  @ViewChild(TaInputComponent) inputRef: TaInputComponent;
  @Input() customClassName: string;
  @Input() file: UploadFile;
  @Input() hasTag: boolean = false;
  @Input() hasNumberOfPages: boolean = false;
  @Input() activePage: number = 1;

  @Output() fileAction: EventEmitter<{ file: UploadFile; action: string }> =
    new EventEmitter<{ file: UploadFile; action: string }>(null);

  public editFile: boolean = false;
  public fileNewName: FormControl = new FormControl();

  constructor(private inputService: TaInputService) {}

  public numberOfFilePages: string = '0';

  public isFileDelete: boolean = false;

  ngOnInit(): void {
    this.inputService.onFocusOutInput$
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.editFile = false;
          if (this.fileNewName.value) {
            this.file.name =
              this.fileNewName.value[0].toUpperCase() +
              this.fileNewName.value.substr(1).toLowerCase();
            this.fileAction.emit({ file: this.file, action: 'edit' });
          }
        }
      });
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
        this.fileAction.emit({ file: this.file, action: 'tag' });
        break;
      }
      case 'download': {
        this.downloadFile(this.file.url, this.file.name);
        break;
      }
      case 'delete': {
        this.fileAction.emit({ file: this.file, action: 'delete' });
        break;
      }
      case 'cancel': {
        this.isFileDelete = false;
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
      this.fileNewName.patchValue(this.file.name);
      const timeout = setTimeout(() => {
        this.inputRef.setInputCursorAtTheEnd(this.inputRef.input.nativeElement);
        clearTimeout(timeout);
      }, 300);
    }
  }

  ngOnDestroy(): void {}
}
