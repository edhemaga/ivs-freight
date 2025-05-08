import { Component, Injectable, TemplateRef } from '@angular/core';

import { Subject } from 'rxjs';

// bootstrap
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// models
import { ConfirmationReset } from '@shared/components/ta-shared-modals/confirmation-reset-modal/models/confirmation-reset.model';
import { ModalOptions } from '@shared/components/ta-modal/models/modal-options.model';

// services
import { EncryptionDecryptionService } from '@shared/services/encryption-decryption.service';

// enums
import { eGeneralActions, eStringPlaceholder } from '@shared/enums';
@Injectable({
    providedIn: 'root',
})
export class ModalService {
    private modalStatusChange: Subject<{
        name: string;
        status: boolean | null;
    }> = new Subject<{ name: string; status: boolean }>();

    private modalSpinner: Subject<{
        action: string;
        status: boolean;
        close: boolean;
    }> = new Subject<{
        action: string;
        status: boolean;
        close: boolean;
    }>();

    // Getter
    public get modalSpinner$() {
        return this.modalSpinner.asObservable();
    }

    public get modalStatus$() {
        return this.modalStatusChange.asObservable();
    }

    constructor(
        private ngbModal: NgbModal,
        private encryptionDecryptionService: EncryptionDecryptionService
    ) {}

    // Setter
    public setModalSpinner(data: {
        action: string;
        status: boolean;
        close: boolean;
    }) {
        this.modalSpinner.next({
            action: data.action,
            status: data.status,
            close: data.close,
        });
    }

    public changeModalStatus(data: {
        name: string;
        status: boolean | null;
    }): void {
        this.modalStatusChange.next({ name: data.name, status: data.status });
    }

    public setProjectionModal(data: {
        action: string;
        payload: {
            key: string;
            value: any;
            id?: any;
            tab?: number;
            data?: any;
            type?: number | string;
            openedTab?: string;
            template?: string;
        };
        component: any;
        size: string;
        type?: string;
        closing?: 'fastest' | 'slowlest';
    }) {
        // Closing Modal and Open New One
        if (data.action === eGeneralActions.OPEN) {
            sessionStorage.clear();
            const timeout = setTimeout(() => {
                sessionStorage.setItem(
                    data.payload.key,
                    JSON.stringify(data.payload.value)
                );

                this.encryptionDecryptionService.setLocalStorage(
                    data.payload.key,
                    data.payload.value
                );

                this.openModal(
                    data.component,
                    { size: data.size },
                    {
                        canOpenModal: true,
                        key: data.payload.key,
                        type: data.type,
                        id: data.payload?.id,
                        tab: data.payload?.tab,
                        data: data.payload?.data,
                        openedTab: data?.payload.openedTab,
                        template: data?.payload?.template,
                    }
                );
                clearTimeout(timeout);
            }, 500);
        }

        // Closing Modal and Open Old One
        if (data.action === eGeneralActions.CLOSE) {
            const timeout = setTimeout(
                () => {
                    this.openModal(
                        data.component,
                        { size: data.size },
                        {
                            ...this.encryptionDecryptionService.getLocalStorage(
                                data.payload.key
                            ),
                            type: data.type,
                            storageData: true,
                        }
                    );
                    this.encryptionDecryptionService.removeItem(
                        data.payload.key
                    );
                    clearTimeout(timeout);
                },
                data?.closing === 'fastest' ? 500 : 3000
            );
        }
    }

    public openModal(
        component: unknown,
        options: ModalOptions,
        editData?: any | ConfirmationReset,
        backdropClass?: string,
        keyboardEsc: boolean = true
    ): Promise<any> {
        options = {
            ...options,
            backdrop: 'static' as any,
            keyboard: keyboardEsc,
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
            instance.windowClass = eStringPlaceholder.EMPTY;
            setTimeout(fx, 100);
        };

        return modal.result;
    }

    public openModalNew(component: any, modalData?: any): NgbModalRef {
        const options = {
            keyboard: true,
            backdropClass: 'myDropback',
        };

        const modal = this.ngbModal.open(component, options);

        if (modalData) {
            modal.componentInstance.modalData = modalData;
            modal.componentInstance.editData = modalData; // for current modals still using this editData
        }

        const instance = (modal as any)._windowCmptRef.instance;
        setTimeout(() => {
            instance.windowClass = 'modal-animation';
        });

        const fx = (modal as any)._removeModalElements.bind(modal);

        (modal as any)._removeModalElements = () => {
            instance.windowClass = eStringPlaceholder.EMPTY;
            setTimeout(fx, 100);
        };

        return modal;
    }
}
