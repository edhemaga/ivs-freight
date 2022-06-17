import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

/* import { SignaturePad } from 'angular2-signaturepad'; */

@Component({
  selector: 'app-applicant-signature-pad',
  templateUrl: './applicant-signature-pad.component.html',
  styleUrls: ['./applicant-signature-pad.component.scss'],
})
export class ApplicantSignaturePadComponent
  implements OnInit, OnChanges, AfterViewInit
{
  /* @ViewChild(SignaturePad) signaturePad!: SignaturePad; */

  public options: Object = {};
  public isSignature = true;
  public signaturePadOptions = {
    minWidth: 0.6,
    canvasWidth: 660,
    canvasHeight: 200,
    backgroundColor: '#6C6C6C',
    penColor: 'white',
  };
  public showSignature: boolean = false;

  @Output() signatureEvent: EventEmitter<any> = new EventEmitter();
  @Input() canvasWidth: number = 660;
  @Input() actionOptions: any;
  @Input() signature: any;
  @Input() canvasBackgroundColor: string = '#6C6C6C';

  constructor() {}

  ngOnInit(): void {
    this.signaturePadOptions.canvasWidth = this.canvasWidth;
    this.signaturePadOptions.backgroundColor = this.canvasBackgroundColor;
  }

  ngOnChanges(changes: SimpleChanges): void {
    /*    if (changes.signature?.currentValue) {
          if (this.signaturePad) {
              this.signaturePad.fromDataURL(changes.signature.currentValue);
          } else {
              this.signature = changes.signature.currentValue;
          }
      } */
  }

  ngAfterViewInit(): void {
    /*    if (this.signature) {
          this.signaturePad.fromDataURL(this.signature);
      } */
  }

  drawSignatureStart() {
    if (this.actionOptions?.canToggleActions) {
      this.actionOptions.hideActionsButtons = false;
    }
  }

  drawSignatureComplete() {
    /*   this.signatureEvent.emit({
          signature: this.signaturePad,
      }); */
  }

  photoUrl() {
    /*  if (this.signature) {
      this.showSignature = true;
      this.isSignature = false;
      return this.sanitizer.bypassSecurityTrustResourceUrl('Base 64 Ide Ovde');
    }

    return ''; */
  }

  undoSignature() {
    // let data = this.signaturePad.toData();
    // if (data) {
    //     data.pop();
    //     this.signaturePad.fromData(data);
    //     /* Hide Options If There Is No Data */
    //     this.actionOptions.hideActionsButtons =
    //         !this.signaturePad.toData().length &&
    //         this.actionOptions?.canToggleActions;
    // }
    // this.signatureEvent.emit({
    //     signature: !this.signaturePad.toData().length
    //         ? undefined
    //         : this.signaturePad,
    // });
  }

  clearSignature() {
    // this.signaturePad.clear();
    // this.isSignature = true;
    // /* Hide Options If There Is No Data */
    // if (this.actionOptions?.canToggleActions) {
    //     this.actionOptions.hideActionsButtons = true;
    // }
    // this.signatureEvent.emit({
    //     signature: undefined,
    // });
  }
}
