import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { ModalService } from './modal.service';
import { UploadFile } from '../ta-upload-files/ta-upload-file/ta-upload-file.component';
import { DropZoneConfig } from '../ta-upload-files/ta-upload-dropzone/ta-upload-dropzone.component';
import { TaUploadFileService } from '../ta-upload-files/ta-upload-file.service';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

@Component({
    selector: 'app-ta-modal',
    templateUrl: './ta-modal.component.html',
    styleUrls: ['./ta-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('widthGrow', [
            state(
                'closed',
                style({
                    transform: 'scale(0)',
                })
            ),
            state(
                'open',
                style({
                    transform: 'scale(1)',
                })
            ),
            transition('closed => open', animate(200)),
        ]),
    ],
})
export class TaModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @Input() modalTitle: string;
    @Input() editName: string;
    @Input() loadModalTemplate: boolean;
    @Input() hazardousLogo?: boolean;
    @Input() editData: any;
    @Input() confirmationData: any;
    @Input() headerSvg: string;
    @Input() saveAndAddNew: boolean;
    @Input() customTextSaveAndAddNew: string;
    @Input() applicantText: boolean;
    @Input() profileUpdateText: boolean;
    @Input() customClass: string;
    @Input() isModalValid: boolean;
    @Input() disableFooter: boolean;
    @Input() disableDelete: boolean;
    @Input() isDeactivated: boolean;
    @Input() isDNU: boolean;
    @Input() isBFB: boolean;
    @Input() resendEmail: boolean;
    @Input() modalAdditionalPart: boolean;
    @Input() topDivider: boolean = true;
    @Input() bottomDivider: boolean = true;
    // Routing Map Props
    @Input() mapSettingsModal: boolean = false;
    @Input() mapRouteModal: boolean = false;
    @Input() resetMapVisibility: boolean = false;
    // -----------------

    @Input() specificCaseModalName: boolean;

    @Input() dropZoneConfig: DropZoneConfig = {
        dropZoneType: 'files', // files | image | media
        dropZoneSvg: 'assets/svg/common/ic_files_dropzone.svg',
        dropZoneAvailableFiles:
            'application/pdf, application/png, application/jpg',
        multiple: true,
        globalDropZone: true,
    };

    @Input() tabChange: any;
    @Input() tabChangePosition: string = 'left'; // left/right

    @Output() action: EventEmitter<{
        action: string;
        bool: boolean;
    }> = new EventEmitter<{ action: string; bool: boolean }>(null);

    @Output() confirmationAction: EventEmitter<{
        data: any;
    }> = new EventEmitter<{ data: any }>(null);

    @Output() onTabHeaderChange: EventEmitter<any> = new EventEmitter<any>();

    @Output('additionalPartVisibility')
    additionalPartVisibilityEvent: EventEmitter<{
        action: string;
        isOpen: boolean;
    }> = new EventEmitter<{ action: string; isOpen: boolean }>();

    private timeout = null;

    public saveSpinnerVisibility: boolean = false;
    public saveAddNewSpinnerVisibility: boolean = false;
    public deleteSpinnerVisibility: boolean = false;
    public resendEmailSpinnerVisibility: boolean = false;
    public loadTemplateSpinnerVisibility: boolean = false;
    public setMapSettingsSpinnerVisibility: boolean = false;
    public setMapRouteSpinnerVisibility: boolean = false;

    // Drag & Drop properties
    public isDropZoneVisible: boolean = false;
    public dropZoneCounter: number = 0;
    public isLeaveZone: boolean = false;
    public hoverZone: boolean = false;

    public mapVisibility: boolean = false;
    public hazardousVisibility: boolean = false;

    constructor(
        private ngbActiveModal: NgbActiveModal,
        private modalService: ModalService,
        private uploadFileService: TaUploadFileService
    ) {}

    ngOnInit(): void {
        this.modalService.modalStatus$
            .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe((data: { name: string; status: boolean }) => {
                switch (data?.name) {
                    case 'deactivate': {
                        this.isDeactivated = data.status;
                        break;
                    }
                    case 'dnu': {
                        this.isDNU = data.status;
                        break;
                    }
                    case 'bfb': {
                        this.isBFB = data.status;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });

        this.uploadFileService.visibilityDropZone$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.dragOver();
                    this.dragLeave();
                    this.dragDrop();
                }
            });

        this.modalService.modalSpinner$
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (data: {
                    action: string;
                    status: boolean;
                    setFasterTimeout: boolean;
                }) => {
                    switch (data.action) {
                        case 'delete': {
                            this.deleteSpinnerVisibility = data.status;
                            break;
                        }
                        case 'save and add new': {
                            this.saveAddNewSpinnerVisibility = data.status;
                            break;
                        }
                        case 'resend email': {
                            this.resendEmailSpinnerVisibility = data.status;
                            break;
                        }
                        case 'load-template': {
                            this.loadTemplateSpinnerVisibility = data.status;
                            break;
                        }
                        case 'set-map-settings': {
                            this.setMapSettingsSpinnerVisibility = data.status;
                            break;
                        }
                        case 'create-map-route': {
                            this.setMapRouteSpinnerVisibility = data.status;
                            break;
                        }
                        default: {
                            this.saveSpinnerVisibility = data.status;
                            break;
                        }
                    }

                    if (
                        !['save and add new', 'load-template'].includes(
                            data.action
                        )
                    ) {
                        const timeout = setTimeout(
                            () => {
                                $('.pac-container').remove();
                                this.ngbActiveModal.close();
                                this.uploadFileService.visibilityDropZone(
                                    false
                                );
                                this.uploadFileService.uploadFiles(null);
                                clearTimeout(timeout);
                            },
                            data?.setFasterTimeout ? 1000 : 2000
                        );
                    }
                }
            );
    }

    public dragOver() {
        $(document).on('dragover', '.modal', (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (this.dropZoneCounter < 1 && !this.isLeaveZone) {
                this.dropZoneCounter++;
            }
            this.isDropZoneVisible = true;
        });
    }

    public dragLeave() {
        $(document).on('dragleave', '.modal', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(() => {
                this.dropZoneCounter--;
                if (this.dropZoneCounter < 1) {
                    this.isDropZoneVisible = false;
                    this.dropZoneCounter = 0;
                    this.isLeaveZone = false;
                }
                clearTimeout(this.timeout);
            }, 150);
        });
    }

    public dragDrop() {
        $(document).on('drop', '.modal', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(() => {
                this.dropZoneCounter = 0;
                this.isDropZoneVisible = false;
                this.isLeaveZone = false;

                clearTimeout(this.timeout);
            }, 150);
        });
    }

    public onAction(action: string) {
        switch (action) {
            case 'save': {
                this.action.emit({ action: action, bool: false });
                break;
            }
            case 'save and add new': {
                this.action.emit({ action: action, bool: false });
                break;
            }
            case 'resend email': {
                this.action.emit({ action: action, bool: false });
                break;
            }
            case 'close': {
                this.action.emit({ action: action, bool: false });
                $('.pac-container').remove();
                this.ngbActiveModal.close();
                this.uploadFileService.visibilityDropZone(false);
                this.uploadFileService.uploadFiles(null);
                break;
            }
            case 'deactivate': {
                this.isDeactivated = !this.isDeactivated;
                this.action.emit({
                    action: action,
                    bool: this.isDeactivated,
                });
                this.confirmationAction.emit(this.confirmationData);
                break;
            }
            case 'activate': {
                this.confirmationAction.emit(this.confirmationData);
                break;
            }
            case 'dnu': {
                this.isDNU = !this.isDNU;
                this.action.emit({ action: action, bool: this.isDNU });
                this.confirmationAction.emit(this.confirmationData);
                break;
            }
            case 'bfb': {
                this.isBFB = !this.isBFB;
                this.action.emit({ action: action, bool: this.isBFB });
                this.confirmationAction.emit(this.confirmationData);
                break;
            }
            case 'delete': {
                this.action.emit({ action: action, bool: false });
                this.confirmationAction.emit(this.confirmationData);
                break;
            }
            case 'multiple delete': {
                this.confirmationAction.emit(this.confirmationData);
                break;
            }
            case 'cdl-void': {
                this.confirmationAction.emit(this.confirmationData);
                break;
            }
            case 'hire': {
                this.confirmationAction.emit(this.confirmationData);
                break;
            }
            case 'archive': {
                this.confirmationAction.emit(this.confirmationData);
                break;
            }
            case 'load-template': {
                this.action.emit({ action: action, bool: false });
                break;
            }
            case 'reset-map-routing': {
                this.action.emit({ action: action, bool: false });
                break;
            }
            case 'set-map-settings': {
                this.action.emit({ action: action, bool: false });
                break;
            }
            case 'create-map-route': {
                this.action.emit({ action: action, bool: false });
                break;
            }
            default: {
                break;
            }
        }
    }

    public onFilesEvent(event: { files: UploadFile[]; action: string }) {
        this.uploadFileService.uploadFiles(event);
    }

    public onDropBackground(event: { action: string; value: boolean }) {
        switch (event.action) {
            case 'dragleave': {
                this.hoverZone = false;
                if (this.timeout) {
                    clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(() => {
                    this.dropZoneCounter = 1;
                    this.isLeaveZone = true;
                    clearTimeout(this.timeout);
                }, 40);

                break;
            }
            case 'drop': {
                if (!event.value) {
                    this.isDropZoneVisible = false;
                    this.dropZoneCounter = 0;
                }
                break;
            }
            case 'dragover': {
                this.dropZoneCounter = 2;
                this.hoverZone = true;
                break;
            }
            default: {
                break;
            }
        }
    }

    public onTabChange(event): void {
        this.onTabHeaderChange.emit(event);
    }

    public toggleAdditionalPart(action: string) {
        switch (action) {
            case 'map': {
                this.mapVisibility = !this.mapVisibility;
                this.hazardousVisibility = false;

                this.additionalPartVisibilityEvent.emit({
                    action: 'map',
                    isOpen: this.mapVisibility,
                });
                break;
            }
            case 'hazardous': {
                this.hazardousVisibility = !this.hazardousVisibility;
                this.mapVisibility = false;

                this.additionalPartVisibilityEvent.emit({
                    action: 'hazardous',
                    isOpen: this.hazardousVisibility,
                });
                break;
            }
            default: {
                break;
            }
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        clearTimeout(this.timeout);
    }
}
