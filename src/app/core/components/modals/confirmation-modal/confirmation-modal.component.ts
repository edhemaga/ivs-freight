import { ImageBase64Service } from './../../../utils/base64.image';
import { Component, Input } from '@angular/core';
import { ConfirmationService } from './confirmation.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface Confirmation {
  id: number;
  data: any;
  template: string; // driver, broker, shipper.....
  // TYPE:  delete, hire, activate, deactivate, info
  // if type is info => subtype: archive, ban, dnu, otherwise subtype = null
  type: string;
  subType: string; // archive, ban-list, dnu
  image: boolean; // has image or not
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
    console.log(data);
    this.confirmationDataSubject.sendConfirmationData(data);
    this.ngbActiveModal.close();
  }
}
