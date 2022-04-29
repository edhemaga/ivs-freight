import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from './modal.options';
import { CompanyAccountModalResponse, CompanyAccountService, CreateCompanyAccountCommand } from 'appcoretruckassist';
import { LocalStorage } from '@ng-idle/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  token = JSON.parse(localStorage.getItem('token'))
  constructor(private ngbModal: NgbModal, private companyAccountService: CompanyAccountService) {}

  public openModal(component: any, options: ModalOptions, editData?: any) {
    options = {
      ...options,
      backdrop: 'static',
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

  // -------------------------- Company Account --------------------------

  public companyAccountModalGet(): Observable<CompanyAccountModalResponse> {
    return this.companyAccountService.apiCompanyaccountModalGet();
  }

  public addCompanyAccount(data: CreateCompanyAccountCommand) {
    return this.companyAccountService.apiCompanyaccountPost(data);
  }
}
