import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-applicant-add-save-btn',
    templateUrl: './applicant-add-save-btn.component.html',
    styleUrls: ['./applicant-add-save-btn.component.scss'],
})
export class ApplicantAddSaveBtnComponent implements OnInit {
    @Input() btnText?: string;
    @Input() disabledValue?: boolean = false;
    @Input() addBtn?: boolean = false;
    @Input() cancelBtn?: boolean = false;
    @Input() saveBtn?: boolean = false;
    @Input() reviewBtn?: boolean = false;

    @Output() clickValueEmitter = new EventEmitter<any>();

    constructor() {}

    ngOnInit(): void {}

    public onGetClickValue(): void {
        if (this.addBtn && !this.disabledValue) {
            this.clickValueEmitter.emit({ notDisabledClick: true });
        }

        if (this.cancelBtn && !this.reviewBtn) {
            this.clickValueEmitter.emit({ cancelClick: true });
        }

        if (this.cancelBtn && this.reviewBtn) {
            this.clickValueEmitter.emit({ reviewCancelClick: true });
        }

        if (this.saveBtn && !this.reviewBtn && !this.disabledValue) {
            this.clickValueEmitter.emit({ saveClick: true });
        }

        if (this.saveBtn && this.reviewBtn && !this.disabledValue) {
            this.clickValueEmitter.emit({ reviewSaveClick: true });
        }
    }
}
