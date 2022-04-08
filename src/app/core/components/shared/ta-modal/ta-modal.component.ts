import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-ta-modal',
  templateUrl: './ta-modal.component.html',
  styleUrls: ['./ta-modal.component.scss']
})
export class TaModalComponent {

  @Input() modalTitle: string;
  @Output() modalActionEmitter: EventEmitter<boolean>;

  public closeModal() {
    this.modalActionEmitter.emit(false);
  }

  public onConfirm() {
    this.modalActionEmitter.emit(true);
  }

}
