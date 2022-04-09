import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from './modal.options';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private ngbModal: NgbModal) {}

  public openModal(
    component: any,
    options: ModalOptions,
    customClass?: string
  ) {
    options = {
      ...options,
      backdrop: 'static',
    };

    const modal = this.ngbModal.open(component, options);

    const instance = (modal as any)._windowCmptRef.instance;
    setTimeout(() => {
      instance.windowClass = 'modal-animation';
    });

    const fx = (modal as any)._removeModalElements.bind(modal);
    (modal as any)._removeModalElements = () => {
      instance.windowClass = '';
      setTimeout(fx, 250);
    };

    setTimeout(() => {
      document
        .getElementsByTagName('ngb-modal-window')[0]
        .addEventListener('scroll', (event) => {
          const dropdownPanel = Array.from(
            document.getElementsByClassName(
              'ng-dropdown-panel'
            ) as HTMLCollectionOf<HTMLElement>
          );
          const ngSelectF =
            document.getElementsByClassName('ng-select-opened')[0];
          let leftOffset;
          let topOffset;
          if (ngSelectF !== null && ngSelectF !== undefined) {
            leftOffset = ngSelectF.getBoundingClientRect().left;
            topOffset = ngSelectF.getBoundingClientRect().top + 26;
          }
          if (
            dropdownPanel !== null &&
            dropdownPanel !== undefined &&
            dropdownPanel.length > 0
          ) {
            dropdownPanel[0].style.left = leftOffset.toString() + 'px';
            dropdownPanel[0].style.top = topOffset.toString() + 'px';
          }
        });
    }, 500);

    return modal;
  }
}
