import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  NgSignaturePadOptions,
  SignaturePadComponent,
} from '@almothafar/angular-signature-pad';

import { ImageBase64Service } from 'src/app/core/utils/base64.image';

import { SelectedMode } from '../state/enum/selected-mode.enum';

@Component({
  selector: 'app-applicant-signature-pad',
  templateUrl: './applicant-signature-pad.component.html',
  styleUrls: ['./applicant-signature-pad.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ApplicantSignaturePadComponent
  implements AfterViewInit, OnChanges
{
  @ViewChild('signature')
  public signaturePad: SignaturePadComponent;

  public signaturePadOptions: NgSignaturePadOptions = {
    minWidth: 5,
    canvasWidth: 616,
    canvasHeight: 187,
    penColor: '#6c6c6c',
  };

  public signature: string;

  @Input() mode: string;
  @Input() signatureImgSrc: any = null;

  @Output() signatureEmitter: EventEmitter<any> = new EventEmitter();

  constructor(public imageBase64Service: ImageBase64Service) {}

  ngAfterViewInit(): void {
    if (this.mode === SelectedMode.APPLICANT && this.signaturePad) {
      this.signaturePad.set('minWidth', 5);
      this.signaturePad.clear();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.signatureImgSrc?.previousValue !==
      changes.signatureImgSrc?.currentValue
    ) {
      this.signatureImgSrc = this.imageBase64Service.sanitizer(
        changes.signatureImgSrc?.currentValue
      );
    }
  }

  public drawStart(event: MouseEvent | Touch): void {
    console.log('Start drawing', event);
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

  public onConfirmDrawing(): void {
    this.signature = this.signaturePad.toDataURL();

    this.signatureImgSrc = this.signature;

    this.signatureEmitter.emit(this.signature);
  }

  public onDeleteImageSrc(): void {
    this.signature = null;

    this.signatureImgSrc = null;

    this.signatureEmitter.emit(null);
  }
}
