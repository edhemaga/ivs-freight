import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-ta-modal',
  templateUrl: './ta-modal.component.html',
  styleUrls: ['./ta-modal.component.scss']
})
export class TaModalComponent {

  @Input() modalTitle: string;
  @Output() modalActionTypeEmitter: EventEmitter<string> = new EventEmitter<string>(null);

  constructor(private ngbActiveModal: NgbActiveModal) {}

  public closeModal() {
    this.modalActionTypeEmitter.emit('close');
    this.ngbActiveModal.dismiss();
  }

  public onConfirm() {
    this.modalActionTypeEmitter.emit('save');
    this.ngbActiveModal.close();
  }

}
