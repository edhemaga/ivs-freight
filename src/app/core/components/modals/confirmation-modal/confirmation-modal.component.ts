import { ImageBase64Service } from './../../../utils/base64.image';
import { Component, Input } from '@angular/core';
import { ConfirmationService } from './confirmation.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface Confirmation {
  id: number;
  data: any;
  template: string; // driver, broker, shipper.....
  type: string; // delete, move, archive, hire, activate, deactivate
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
    this.confirmationDataSubject.sendConfirmationData(data);
    this.ngbActiveModal.close();
  }
}
