import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';

export interface UploadFile {
  name: string;
  url: string | any;
  extension: string;
  guid: string;
  size: number | string;
  tag?: string;
}

@Component({
  selector: 'app-ta-upload-file',
  templateUrl: './ta-upload-file.component.html',
  styleUrls: ['./ta-upload-file.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaUploadFileComponent {
  @Input() file: UploadFile;
  @Input() hasTag: boolean = false;
  @Input() activePage: number = 1;

  @Output() fileAction: EventEmitter<{ file: UploadFile; action: string }> =
    new EventEmitter<{ file: UploadFile; action: string }>(null);

  public numberOfFilePages: string = '0';

  public isFileDelete: boolean = false;

  public afterLoadComplete(pdf: PDFDocumentProxy) {
    this.numberOfFilePages = pdf._pdfInfo.numPages
      .toString()
      .concat(' ', 'pages');
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
}
