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
        penColor: '#6c6c6c',
    };

<<<<<<< HEAD
    public signature: string;

    public displayActionButtons: boolean = false;

    @Input() mode: string;
    @Input() signatureImgSrc: any = null;
    @Input() displayRequiredNote: boolean = false;
=======
    @Input() signature: any;
>>>>>>> develop

    @Output() signatureEmitter: EventEmitter<any> = new EventEmitter();
    @Output() removeRequiredNoteEmitter: EventEmitter<any> = new EventEmitter();

    constructor() {}

    ngAfterViewInit(): void {
<<<<<<< HEAD
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

        if (
            changes.displayRequiredNote?.previousValue !==
            changes.displayRequiredNote?.currentValue
        ) {
            this.displayRequiredNote =
                changes.displayRequiredNote?.currentValue;
        }
=======
        this.signaturePad.set('minWidth', 5);
        this.signaturePad.clear();
>>>>>>> develop
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

<<<<<<< HEAD
        this.signatureImgSrc = this.signature;

        this.displayActionButtons = false;

=======
>>>>>>> develop
        this.signatureEmitter.emit(this.signature);
    }
}
