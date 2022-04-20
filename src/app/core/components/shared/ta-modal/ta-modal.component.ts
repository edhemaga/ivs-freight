import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-ta-modal',
  templateUrl: './ta-modal.component.html',
  styleUrls: ['./ta-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaModalComponent {
  @Input() modalTitle: string;
  @Input() customClass: string;
  private timeout = null;

  @Output() modalActionTypeEmitter: EventEmitter<string> =
    new EventEmitter<string>(null);

  constructor(private ngbActiveModal: NgbActiveModal) {}

  public closeModal() {
    this.modalActionTypeEmitter.emit('close');
    $('.pac-container').remove();
    this.timeout = setTimeout(() => {
      this.ngbActiveModal.dismiss();
      clearTimeout(this.timeout);
    }, 150);
  }

  public onConfirm() {
    this.modalActionTypeEmitter.emit('save');
  }
}
