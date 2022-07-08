import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-ta-file',
  templateUrl: './ta-file.component.html',
  styleUrls: ['./ta-file.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaFileComponent implements OnInit {
  @Input() file: any = null;
  @Input() customClassName: string = null;
  @Input() activePage: number = 1;

  @Output() fileActionEmitter: EventEmitter<{
    fileName: string;
    action: string;
  }> = new EventEmitter<{ fileName: string; action: string }>();

  public numberOfFilePages: string = '0';

  ngOnInit(): void {}

  public afterLoadComplete(pdf: PDFDocumentProxy) {
    this.numberOfFilePages = pdf._pdfInfo.numPages
      .toString()
      .concat(' ', 'PAGES');
  }

  public onFileAction(action: string) {
    switch (action) {
      case 'download': {
        this.downloadFile(this.file.url, this.file.fileName);
        break;
      }
      case 'delete': {
        this.deleteFile(this.file.fileName);
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

  public deleteFile(fileName: string) {
    this.fileActionEmitter.emit({ fileName: fileName, action: 'delete' });
  }
}
