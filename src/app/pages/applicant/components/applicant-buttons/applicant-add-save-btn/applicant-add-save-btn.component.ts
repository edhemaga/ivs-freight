import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

// modules
import { SharedModule } from '@shared/shared.module';

@Component({
    selector: 'app-applicant-add-save-btn',
    templateUrl: './applicant-add-save-btn.component.html',
    styleUrls: ['./applicant-add-save-btn.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class ApplicantAddSaveBtnComponent implements OnInit {
    @Input() btnText?: string;
    @Input() disabledValue?: boolean = false;
    @Input() addBtn?: boolean = false;
    @Input() cancelBtn?: boolean = false;
    @Input() saveBtn?: boolean = false;
    @Input() reviewBtn?: boolean = false;
    @Input() sizeSmall?: boolean = false;

    @Output() clickValueEmitter = new EventEmitter<any>();

    constructor() {}

    ngOnInit(): void {}

    public onGetClickValue(): void {
        if (this.addBtn) {
            this.clickValueEmitter.emit({ notDisabledClick: true });
        }

        if (this.cancelBtn && !this.reviewBtn) {
            this.clickValueEmitter.emit({ cancelClick: true });
        }

        if (this.cancelBtn && this.reviewBtn) {
            this.clickValueEmitter.emit({ reviewCancelClick: true });
        }

        if (this.saveBtn && !this.reviewBtn) {
            this.clickValueEmitter.emit({ saveClick: true });
        }

        if (this.saveBtn && this.reviewBtn) {
            this.clickValueEmitter.emit({ reviewSaveClick: true });
        }
    }
}
