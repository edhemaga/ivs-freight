import { ImageBase64Service } from '../../../utils/base64.image';
import { Component, Input } from '@angular/core';
import { ConfirmationService } from './confirmation.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface Confirmation {
    template: string; // examples: driver, broker, shipper.....
    type:
        | 'delete'
        | 'multiple delete'
        | 'hire'
        | 'activate'
        | 'deactivate'
        | 'info'; // if type is info => subtype must be: archive | ban list | dnu | void;
    id?: number;
    data?: any;
    array?: any[];
    subType?: 'archive' | 'ban list' | 'dnu' | 'cdl void'; // if subType set, must set and subTypeStatus (except when subType: cdl void)
    subTypeStatus?: 'move' | 'remove'; // example: move -> 'Move to Ban List', remove -> 'Remove from Ban List', void -> void
    cdlStatus?: 'New' | 'Renew' | 'Activate';
    image?: boolean; // has image or not
    svg?: boolean; // has svg or not
    rating?: boolean; // has rating or not
    modalHeader?: boolean;
}
@Component({
    selector: 'app-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
    @Input() editData: Confirmation;

    constructor(
        public imageBase64Service: ImageBase64Service,
        private ngbActiveModal: NgbActiveModal,
        private confirmationDataSubject: ConfirmationService
    ) {}

    public onModalAction(data: any) {
        // Multiple Delete
        if (this.editData.type === 'multiple delete') {
            this.confirmationDataSubject.sendConfirmationData({
                ...data,
                array: data.array.map((item) => item.id),
            });
        } else {
            this.confirmationDataSubject.sendConfirmationData(data);
        }

        this.ngbActiveModal.close();
    }

    public identity = (index: number, _: any): number => index;
}
