import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ModalOptions } from './modal.options';
import { EncryptionDecryptionService } from '../../../services/encryption-decryption/EncryptionDecryption.service';
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

    public changeModalStatus(data: { name: string; status: boolean | null }) {
        this.modalStatusChange.next({ name: data.name, status: data.status });
    }

    public setProjectionModal(data: {
        action: string;
        payload: { key: string; value: any; id?: any };
        component: any;
        size: string;
        type?: string;
        closing?: 'fastest' | 'slowlest';
    }) {
        // Closing Modal and Open New One
        if (data.action === 'open') {
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
                    }
                );
                clearTimeout(timeout);
            }, 500);
        }

        // Closing Modal and Open Old One
        if (data.action === 'close') {
            const timeout = setTimeout(
                () => {
                    this.openModal(
                        data.component,
                        { size: data.size },
                        {
                            storageData:
                                this.encryptionDecryptionService.getLocalStorage(
                                    data.payload.key
                                ),
                            type: data.type,
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
        component: any,
        options: ModalOptions,
        editData?: any,
        backdropClass?: string,
        keyboardEsc: boolean = true
    ) {
        console.log(keyboardEsc);
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
            instance.windowClass = '';
            setTimeout(fx, 100);
        };

        return modal;
    }
}
