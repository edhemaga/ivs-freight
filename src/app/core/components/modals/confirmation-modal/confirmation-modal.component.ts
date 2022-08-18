import { ImageBase64Service } from './../../../utils/base64.image';
import { Component, Input } from '@angular/core';
import { ConfirmationService } from './confirmation.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface Confirmation {
  template: string; // examples: driver, broker, shipper.....
  type:
    | string
    | 'delete'
    | 'multiple delete'
    | 'hire'
    | 'activate'
    | 'deactivate'
    | 'info'; // if type is info => subtype must be: archive | ban list | dnu;
  id?: number;
  data?: any;
  array?: any[];
  subType?: string | 'archive' | 'ban list' | 'dnu'; // if subType set, must set and subTypeStatus
  subTypeStatus?: string | 'move' | 'remove'; // example: move -> 'Move to Ban List', remove -> 'Remove from Ban List'
  image?: boolean; // has image or not
  svg?: boolean; // has svg or not
  rating?: boolean; // has rating or not
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

  ngOnInit() {
    console.log(this.editData);
  }

  public onModalAction(data: any) {
    console.log(data);
    this.confirmationDataSubject.sendConfirmationData(data);
    this.ngbActiveModal.close();
  }
}
