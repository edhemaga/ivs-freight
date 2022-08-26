import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { EncryptionDecryptionService } from 'src/app/core/services/encryption-decryption/EncryptionDecryption.service';
import { ModalOptions } from './modal.options';
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalStatusChange: Subject<{ name: string; status: boolean | null }> =
    new Subject<{ name: string; status: boolean }>();

  private modalSpinner: Subject<{ action: string; status: boolean }> =
    new Subject<{ action: string; status: boolean }>();

  constructor(
    private ngbModal: NgbModal,
    private encryptionDecryptionService: EncryptionDecryptionService
  ) {}

  // Getter
  public get modalSpinner$() {
    return this.modalSpinner.asObservable();
  }

  public get modalStatus$() {
    return this.modalStatusChange.asObservable();
  }

  // Setter
  public setModalSpinner({ action: string, status: boolean }) {
    this.modalSpinner.next({ action: string, status: boolean });
  }

  public changeModalStatus(data: { name: string; status: boolean | null }) {
    this.modalStatusChange.next({ name: data.name, status: data.status });
  }

  public setProjectionModal(data: {
    action: string;
    payload: { key: string; value: any };
    component: any;
    size: string;
    type?: string;
  }) {
    console.log('Projection modal: ', data);
    const timeout = setTimeout(() => {
      if (data.action === 'open') {
        sessionStorage.setItem(
          data.payload.key,
          JSON.stringify(data.payload.value)
        );

        // this.encryptionDecryptionService.setLocalStorage(
        //   data.payload.key,
        //   data.payload.value
        // );

        this.openModal(
          data.component,
          { size: data.size },
          { canOpenModal: true, key: data.payload.key, type: data.type }
        );
      }

      if (data.action === 'close') {
        this.openModal(
          data.component,
          { size: data.size },
          {
            storageData: JSON.parse(sessionStorage.getItem(data.payload.key)),
            type: data.type,
          }
        );
        sessionStorage.removeItem(data.payload.key);
      }

      clearTimeout(timeout);
    }, 250);
  }

  public openModal(
    component: any,
    options: ModalOptions,
    editData?: any,
    backdropClass?: string
  ) {
    options = {
      ...options,
      backdrop: 'static',
      backdropClass: backdropClass ? backdropClass : 'myDropback',
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
