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

  public numberOfFilePages: string = '0';

  ngOnInit(): void {
    console.log(this.file);
  }

  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.numberOfFilePages = pdf._pdfInfo.numPages.toString().concat(" ", "PAGES");
  }
}
