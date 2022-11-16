import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../../services/shared/shared.service';

@Component({
    selector: 'app-delete-dialog',
    templateUrl: './delete-dialog.component.html',
    styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
    @Input() inputData: any;

    constructor(
        private activeModal: NgbActiveModal,
        private sharedService: SharedService
    ) {}

    ngOnInit(): void {}

    closeDeleteModal() {
        this.activeModal.close();
    }

    deleteRecord() {
        this.sharedService.emitDeleteAction.emit(this.inputData);
        this.closeDeleteModal();
    }
}
