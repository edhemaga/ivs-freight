import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ModalOptions } from './modal.options';
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public modalStatusChange: Subject<{ name: string; status: boolean | null }> =
    new Subject<{ name: string; status: boolean }>();

  public modalSpinner: Subject<{ action: string; status: boolean }> =
    new Subject<{ action: string; status: boolean }>();

  constructor(private ngbModal: NgbModal) {}

  public get modalSpinner$() {
    return this.modalSpinner.asObservable();
  }

  public setModalSpinner({ action: string, status: boolean }) {
    this.modalSpinner.next({ action: string, status: boolean });
  }

  public get modalStatus$() {
    return this.modalStatusChange.asObservable();
  }

  public changeModalStatus(data: { name: string; status: boolean | null }) {
    this.modalStatusChange.next({ name: data.name, status: data.status });
  }

  public openModal(component: any, options: ModalOptions, editData?: any) {
    options = {
      ...options,
      backdrop: 'static',
      backdropClass: 'myDropback',
    };

    const modal = this.ngbModal.open(component, options);

    if (editData != null) {
      modal.componentInstance.editData = editData;
    }

    const instance = (modal as any)._windowCmptRef.instance;
    setTimeout(() => {
      instance.windowClass = 'modal-animation';
    });

    const fx = (modal as any)._removeModalElements.bind(modal);

    (modal as any)._removeModalElements = () => {
      instance.windowClass = '';
      setTimeout(fx, 250);
    };

    return modal;
  }
}
