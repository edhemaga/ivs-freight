import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from './modal.service';
import { modal_animation } from './modal.animation';

@Component({
  selector: 'app-ta-modal',
  templateUrl: './ta-modal.component.html',
  styleUrls: ['./ta-modal.component.scss'],
})
export class TaModalComponent implements OnInit {
  @Input() modalTitle: string;
  @Input() customClass: string;
  
  @Output() modalActionTypeEmitter: EventEmitter<string> =
    new EventEmitter<string>(null);
  public modalActive: boolean = false;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.modalService.modalSubject$.subscribe(
      (active) => (this.modalActive = active)
    );
  }

  public closeModal() {
    this.modalActionTypeEmitter.emit('close');
    this.ngbActiveModal.dismiss();
  }

  public onConfirm() {
    this.modalActionTypeEmitter.emit('save');
    this.ngbActiveModal.close();
  }
}
