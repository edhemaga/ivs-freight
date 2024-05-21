/* eslint-disable no-unused-vars */

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
import { SafeResourceUrl } from '@angular/platform-browser';

// signature pad
import {
    NgSignaturePadOptions,
    SignaturePadComponent,
} from '@almothafar/angular-signature-pad';

// services
import { ImageBase64Service } from '@shared/services/image-base64.service';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';
import { ApplicantSvgRoutes } from '@pages/applicant/utils/helpers/applicant-svg-routes';

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

    @Input() mode: string;
    @Input() signatureImgSrc: any = null;
    @Input() displayRequiredNote: boolean = false;

    @Output() signatureEmitter: EventEmitter<any> = new EventEmitter();
    @Output() removeRequiredNoteEmitter: EventEmitter<any> = new EventEmitter();

    public signaturePadOptions: NgSignaturePadOptions = {
        minWidth: 5,
        canvasWidth: 616,
        canvasHeight: 187,
        penColor: '#6c6c6c',
    };

    public signature: string;
    public signatureImgSrcCopy: string | SafeResourceUrl = null;

    public displayActionButtons: boolean = false

    public applicantSvgRoutes = ApplicantSvgRoutes;


    constructor(public imageBase64Service: ImageBase64Service) {}

    get isSignautrePadEmpty() {
        return this.signaturePad?.isEmpty();
    }

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

            this.signatureImgSrcCopy = this.imageBase64Service.sanitizer(
                changes.signatureImgSrc?.currentValue
            );
        }

        if (
            changes.displayRequiredNote?.previousValue !==
            changes.displayRequiredNote?.currentValue
        ) {
            this.displayRequiredNote =
                changes.displayRequiredNote?.currentValue;
        }

    }

    public onDrawStart(event: MouseEvent | Touch): void {
        this.displayActionButtons = true;

        this.removeRequiredNoteEmitter.emit(true);
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
        }
    }

    public onConfirmDrawing(): void {
        this.signature = this.signaturePad.toDataURL();

        this.signatureImgSrc = this.signature;
        this.signatureImgSrcCopy = this.signature;

        this.displayActionButtons = false;

        this.signatureEmitter.emit(this.signature);
    }

    public onDeleteImageSrc(): void {
        this.signature = null;

        this.signatureImgSrc = null;

        this.signatureEmitter.emit(null);
    }

    public onUseSavedSignature(): void {
        this.signatureImgSrc = this.signatureImgSrcCopy;

        this.signature = this.signatureImgSrc;

        this.displayActionButtons = false;

        this.signatureEmitter.emit(this.signature);
    }
}
