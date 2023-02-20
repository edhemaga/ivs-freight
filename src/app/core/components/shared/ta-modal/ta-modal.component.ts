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
import {
    DropZoneConfig,
    TaUploadDropzoneComponent,
} from '../ta-upload-files/ta-upload-dropzone/ta-upload-dropzone.component';
import { TaUploadFileService } from '../ta-upload-files/ta-upload-file.service';
import { AuthGuard } from '../../../guards/authentication.guard';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import { CustomScrollbarComponent } from '../custom-scrollbar/custom-scrollbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TaSpinnerComponent } from '../ta-spinner/ta-spinner.component';
import { TaTabSwitchComponent } from '../../standalone-components/ta-tab-switch/ta-tab-switch.component';

@Component({
    selector: 'app-ta-modal',
    templateUrl: './ta-modal.component.html',
    styleUrls: ['./ta-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        CustomScrollbarComponent,
        TaUploadDropzoneComponent,
        FormsModule,
        DragDropModule,
        AppTooltipComponent,
        AngularSvgIconModule,
        TaSpinnerComponent,
        TaTabSwitchComponent,
    ],
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
    host: {
        '(document:keyup)': 'onKeyUp($event)',
    },
    providers: [AuthGuard],
})
export class TaModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @Input() modalTitle: string;
    @Input() editName: string;
    @Input() loadModalTemplate: boolean;
    @Input() isVisibleHazardous?: boolean;
    @Input() isVisibleMap?: boolean;
    @Input() editData: any;
    @Input() confirmationData: any;
    @Input() headerSvg: string;
    @Input() saveAndAddNew: boolean;
    @Input() customTextSaveAndAddNew: string;
    @Input() applicantText: boolean;
    @Input() profileUpdateText: boolean;
    @Input() customClass: string;
    @Input() partClass: string;
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
            'application/pdf, image/png, image/jpeg, image/jpg',
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
        this.onModalStatus();
        this.onModalSpinner();

        this.uploadFileService.visibilityDropZone$
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.dragOver();
                    this.dragLeave();
                    this.dragDrop();
                }
            });
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

            setTimeout(() => {
                this.dropZoneCounter--;
                if (this.dropZoneCounter < 1) {
                    this.isDropZoneVisible = false;
                    this.dropZoneCounter = 0;
                    this.isLeaveZone = false;
                }
            }, 150);
        });
    }

    public dragDrop() {
        $(document).on('drop', '.modal', (event) => {
            event.preventDefault();
            event.stopPropagation();

            setTimeout(() => {
                this.dropZoneCounter = 0;
                this.isDropZoneVisible = false;
                this.isLeaveZone = false;
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
            case 'favorite': {
                this.confirmationAction.emit(this.confirmationData);
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

                setTimeout(() => {
                    this.dropZoneCounter = 1;
                    this.isLeaveZone = true;
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

    public onModalStatus() {
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
    }

    public onModalSpinner() {
        this.modalService.modalSpinner$
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (data: { action: string; status: boolean; close: boolean }) => {
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
                        ) &&
                        data.close
                    ) {
                        $('.pac-container').remove();
                        this.ngbActiveModal.close();
                        this.uploadFileService.visibilityDropZone(false);
                        this.uploadFileService.uploadFiles(null);
                    }
                }
            );
    }

    public onKeyUp(ev: any) {
        if (ev.keyCode === 13 && !ev.target.closest('.application-dropdown')) {
            this.action.emit({ action: 'save', bool: false });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
