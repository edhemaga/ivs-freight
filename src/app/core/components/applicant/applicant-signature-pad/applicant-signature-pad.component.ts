import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  NgSignaturePadOptions,
  SignaturePadComponent,
} from '@almothafar/angular-signature-pad';

@Component({
  selector: 'app-applicant-signature-pad',
  templateUrl: './applicant-signature-pad.component.html',
  styleUrls: ['./applicant-signature-pad.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ApplicantSignaturePadComponent implements AfterViewInit {
  @ViewChild('signature')
  public signaturePad: SignaturePadComponent;

  public signaturePadOptions: NgSignaturePadOptions = {
    minWidth: 5,
    canvasWidth: 616,
    canvasHeight: 187,
    backgroundColor: '#AAAAAA',
    penColor: '#FFFFFF',
  };

  @Input() signature: any;

  @Output() signatureEmitter: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngAfterViewInit(): void {
    this.signaturePad.set('minWidth', 5);
    this.signaturePad.clear();
  }

  public drawStart(event: MouseEvent | Touch): void {
    console.log('Start drawing', event);
  }

  public drawComplete(event: MouseEvent | Touch): void {
    this.signature = this.signaturePad.toDataURL();

    this.signatureEmitter.emit(this.signature);
  }

  public onClearDrawing(): void {
    this.signaturePad.clear();

    this.signatureEmitter.emit(null);
  }

  public onUndoDrawing(): void {
    const data = this.signaturePad.toData();

    if (data) {
      data.pop();

      this.signaturePad.fromData(data);

      this.signature = this.signaturePad.toDataURL();

      this.signatureEmitter.emit(this.signature);
    }
  }
}
