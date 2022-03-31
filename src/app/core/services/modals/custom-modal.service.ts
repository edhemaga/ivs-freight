import {Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomModalService {
  private modalIdentifierChange = new Subject<any>();

  constructor(private modalService: NgbModal) {
  }

  get changedIndetifier() {
    return this.modalIdentifierChange;
  }

  /**
   * Open modal function
   *
   * @param component Any
   * @param inputData Any
   * @param customClass String
   * @param modalSize Any
   */
  public openModal(component: any, inputData?: any, customClass?: string, modalSize?: any) {
    const options = {
      size: modalSize !== undefined ? modalSize.size : undefined,
      autofocus: false
    };
    const modal = this.modalService.open(component, options);
    if (inputData !== null) {
      modal.componentInstance.inputData = inputData;
    }
    const instance = (modal as any)._windowCmptRef.instance;
    setTimeout(() => {
      instance.windowClass = `modal-animation${customClass !== null ? ` ${customClass}` : ''}`;
    });

    const fx = (modal as any)._removeModalElements.bind(modal);
    (modal as any)._removeModalElements = () => {
      instance.windowClass = '';
      setTimeout(fx, 250);
    };

    setTimeout(() => {
      document.getElementsByTagName('ngb-modal-window')[0].addEventListener('scroll', (event) => {
        const dropdownPanel = Array.from(document.getElementsByClassName('ng-dropdown-panel') as HTMLCollectionOf<HTMLElement>);
        const ngSelectF = document.getElementsByClassName('ng-select-opened')[0];
        let leftOffset;
        let topOffset;
        if (ngSelectF !== null && ngSelectF !== undefined) {
          leftOffset = ngSelectF.getBoundingClientRect().left;
          topOffset = ngSelectF.getBoundingClientRect().top + 26;
        }
        if (dropdownPanel !== null && dropdownPanel !== undefined && dropdownPanel.length > 0) {
          dropdownPanel[0].style.left = leftOffset.toString() + 'px';
          dropdownPanel[0].style.top = topOffset.toString() + 'px';
        }
      });
    }, 500);

    return modal;
  }

  /**
   * Dismiss modal function
   */
  public dismissModal(): any {
    this.modalService.dismissAll();
  }


}
