import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

// pipes
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

// bootstrap
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';

// services
import { ModalService } from '@shared/services/modal.service';
import { TaUploadFileService } from '@shared/components/ta-upload-files/services/ta-upload-file.service';

// components
import { TaUploadDropzoneComponent } from '@shared/components/ta-upload-files/components/ta-upload-dropzone/ta-upload-dropzone.component';
import { TaCustomScrollbarComponent } from '@shared/components/ta-custom-scrollbar/ta-custom-scrollbar.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaSpinnerComponent } from '@shared/components/ta-spinner/ta-spinner.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';

// guards
import { AuthGuard } from '@core/guards/authentication.guard';

// models
import { DropZoneConfig } from '@shared/components/ta-upload-files/models/dropzone-config.model';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';

@Component({
    selector: 'app-ta-modal',
    templateUrl: './ta-modal.component.html',
    styleUrls: ['./ta-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        DragDropModule,
        AngularSvgIconModule,
        NgbModule,

        // components
        FormatDatePipe,
        TaCustomScrollbarComponent,
        TaUploadDropzoneComponent,
        TaAppTooltipV2Component,
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
            transition('closed => open', animate(100)),
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
    @Input() isFinishOrder?: boolean = false;
    @Input() isDeactivated: boolean;
    @Input() isDNU: boolean;
    @Input() isBFB: boolean;
    @Input() editDate: boolean;
    @Input() resendEmail: boolean;
    @Input() modalAdditionalPart: boolean;
    @Input() topDivider: boolean = true;
    @Input() bottomDivider: boolean = true;
    @Input() isConvertedToTemplate?: boolean = false;
    @Input() isStepper: boolean = false;
    @Input() isCloseIconRemoved: boolean = false;
    @Input() isVoidBtn: boolean = false;

    // Routing Map Props
    @Input() mapSettingsModal: boolean = false;
    @Input() mapRouteModal: boolean = false;
    @Input() resetMapVisibility: boolean = false;
    @Input() showCounter: boolean = false;

    // Cards Modal
    @Input() isCardsModal: boolean = false;
    @Input() isResetFormCards: boolean = false;
    @Input() cardsSecTitle: string;
    @Input() showCloseBusinessButton = false;
    @Input() isAdditionalAssignLoadModalVisible = false;
    @Input() isAssignLoadModal = false;

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

    @Input() isBluredNotice: boolean = true;

    // Use case when we want user to submit form and run validation and show form errors
    @Input() enableClickWhileFormInvalid: boolean = false;

    @Output() action: EventEmitter<{
        action: string;
        bool: boolean;
    }> = new EventEmitter<{ action: string; bool: boolean }>(null);

    @Output() confirmationAction: EventEmitter<{
        data: any;
    }> = new EventEmitter<{ data: any }>(null);

    @Output() onTabHeaderChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() runFormValidation: EventEmitter<boolean> =
        new EventEmitter<boolean>();

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

    public stepperCounter: number = 0;

    // Drag & Drop properties
    public isDropZoneVisible: boolean = false;
    public dropZoneCounter: number = 0;
    public isLeaveZone: boolean = false;
    public hoverZone: boolean = false;

    public mapVisibility: boolean = false;
    public hazardousVisibility: boolean = false;
    public isSidePanelActive: boolean = false;

    constructor(
        private ngbActiveModal: NgbActiveModal,
        private modalService: ModalService,
        private uploadFileService: TaUploadFileService,
        private ref: ChangeDetectorRef
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
        // $("body").on('dragenter', (event) => {
        //     event.preventDefault();
        //     event.stopPropagation();
        //     if (this.dropZoneCounter < 1 && !this.isLeaveZone) {
        //         this.dropZoneCounter++;
        //     }
        //     this.isDropZoneVisible = true;
        // });
    }
    public dragLeave() {
        // $("body").on('dragleave', (event: any) => {
        //     event.preventDefault();
        //     event.stopPropagation();
        //     if (!event.fromElement) {
        //         setTimeout(() => {
        //             this.dropZoneCounter--;
        //             if (this.dropZoneCounter < 1) {
        //                 this.isDropZoneVisible = false;
        //                 this.dropZoneCounter = 0;
        //                 this.isLeaveZone = false;
        //             }
        //         }, 150);
        //     }
        // });
    }

    @HostListener('dragover', ['$event']) public onDragOver(evt) {
        evt.preventDefault();
    }

    @HostListener('body:dragenter', ['$event'])
    onWindowDragEnter(event: any): void {
        event.preventDefault();
        const startPointClassToDragOver = event.toElement.classList.contains(
            'custom-scrollbar-holder'
        );
        if (startPointClassToDragOver) {
            if (this.dropZoneCounter < 1 && !this.isLeaveZone) {
                this.dropZoneCounter++;
            }
            this.isDropZoneVisible = true;
        }
    }

    @HostListener('body:dragleave', ['$event'])
    onDragLeaveWindows(e) {
        e.preventDefault();
        if (!e.fromElement) {
            // this will ensure that you are not in the browser anymore
            setTimeout(() => {
                this.dropZoneCounter--;
                if (this.dropZoneCounter < 1) {
                    this.isDropZoneVisible = false;
                    this.dropZoneCounter = 0;
                    this.isLeaveZone = false;
                    this.ref.detectChanges();
                }
            }, 150);
        }
    }

    @HostListener('drop', ['$event'])
    onDragDrop(e) {
        e.preventDefault();
        setTimeout(() => {
            this.dropZoneCounter = 0;
            this.isDropZoneVisible = false;
            this.isLeaveZone = false;
        }, 150);
    }

    public dragDrop() {
        // $("body").on('drop',(event) => {
        //     event.preventDefault();
        //     event.stopPropagation();
        //     setTimeout(() => {
        //         this.dropZoneCounter = 0;
        //         this.isDropZoneVisible = false;
        //         this.isLeaveZone = false;
        //     }, 150);
        // });
    }

    public onAction(action: string) {
        if (!this.isModalValid && this.enableClickWhileFormInvalid)
            this.runFormValidation.emit(true);

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
            case 'business': {
                this.confirmationAction.emit(this.confirmationData);
                break;
            }
            case 'convert-to-template': {
                this.action.emit({ action: action, bool: false });
                break;
            }
            case 'stepper-next':
                this.stepperCounter++;

                this.action.emit({ action: action, bool: false });

                break;
            case 'stepper-back':
                this.stepperCounter--;

                this.action.emit({ action: action, bool: false });

                break;
            case 'stepper-save':
                this.action.emit({ action: action, bool: false });

                break;
            case 'cards-modal': {
                this.action.emit({ action: action, bool: false });
                this.ngbActiveModal.close();
                break;
            }
            case 'reset-to-default': {
                this.action.emit({ action: action, bool: false });
                break;
            }
            case 'finish-order': {
                this.action.emit({ action: action, bool: false });

                break;
            }
            case 'CLOSE_BUSINESS': {
                this.action.emit({ action: action, bool: false });
                break;
            }
            case 'void-cdl': {
                this.confirmationAction.emit(this.confirmationData);

                break;
            }
            case 'void': {
                this.action.emit({ action: action, bool: false });

                break;
            }
            case 'change-status': {
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
            case 'side-panel': {
                this.isSidePanelActive = !this.isSidePanelActive;
                this.additionalPartVisibilityEvent.emit({
                    action: 'side-panel',
                    isOpen: this.isSidePanelActive,
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
                    this.ref.detectChanges();
                    if (
                        !['save and add new'].includes(data.action) &&
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
        if (
            ev.keyCode === 13 &&
            !ev.target.closest('.application-dropdown') &&
            this.isBluredNotice
        ) {
            this.action.emit({ action: 'save', bool: false });
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
